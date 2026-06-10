import client from 'prom-client';

// ─── Registro de Prometheus ───────────────────────────────────────────────────

const registro = new client.Registry();
client.collectDefaultMetrics({ register: registro });

// ─── Contadores y Histogramas de Prometheus ───────────────────────────────────

export const contadorSolicitudesHttp = new client.Counter({
  name: 'solicitudes_http_totales',
  help: 'Cantidad total de solicitudes HTTP',
  labelNames: ['metodo', 'ruta', 'estado'],
  registers: [registro],
});

export const contadorConsultasBd = new client.Counter({
  name: 'consultas_bd_totales',
  help: 'Cantidad total de consultas a la base de datos',
  registers: [registro],
});

export const histogramaDuracionSolicitudes = new client.Histogram({
  name: 'duracion_solicitudes_http_segundos',
  help: 'Duración de solicitudes HTTP en segundos',
  labelNames: ['metodo', 'ruta', 'estado'],
  registers: [registro],
  buckets: [0.001, 0.01, 0.1, 1, 5],
});

export const histogramaDuracionConsultasBd = new client.Histogram({
  name: 'duracion_consultas_bd_segundos',
  help: 'Duración de consultas a la BD en segundos',
  registers: [registro],
  buckets: [0.0005, 0.001, 0.005, 0.01, 0.1, 1],
});

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface EntradaSolicitud {
  clave: string;
  categoria: string;
  timestamp: number;
}

interface DatosPorClave {
  total: number;
  duracionTotal: number;
}

// ─── Almacenamiento interno ───────────────────────────────────────────────────

const datosPorClave = new Map<string, DatosPorClave>();
const totalesPorCategoria = new Map<string, number>();
const historial: EntradaSolicitud[] = [];

// ─── Funciones auxiliares ─────────────────────────────────────────────────────

function obtenerCategoria(ruta: string): string {
  const coincidencia = ruta.match(/^\/api\/([^\/]+)/);
  return coincidencia ? coincidencia[1] : 'general';
}

function limpiarHistorialAntiguo(ventanaMs: number): EntradaSolicitud[] {
  const limite = Date.now() - ventanaMs;
  const recientes = historial.filter(entrada => entrada.timestamp >= limite);
  historial.length = 0;
  historial.push(...recientes);
  return recientes;
}

// ─── Función principal de registro ───────────────────────────────────────────

export function registrarSolicitudInterna(metodo: string, ruta: string, duracionSegundos: number) {
  const clave = `${metodo} ${ruta}`;
  const categoria = obtenerCategoria(ruta);

  const datosPrevios = datosPorClave.get(clave) ?? { total: 0, duracionTotal: 0 };
  datosPorClave.set(clave, {
    total: datosPrevios.total + 1,
    duracionTotal: datosPrevios.duracionTotal + duracionSegundos,
  });

  totalesPorCategoria.set(categoria, (totalesPorCategoria.get(categoria) ?? 0) + 1);

  historial.push({ clave, categoria, timestamp: Date.now() });
}

// ─── Generación del JSON de métricas ─────────────────────────────────────────

export async function obtenerMetricasJSON() {
  const VENTANA_MS = 5 * 60 * 1000;
  const MINUTOS_VENTANA = 5;

  const recientes = limpiarHistorialAntiguo(VENTANA_MS);

  const recientesPorClave = new Map<string, number>();
  const recientesPorCategoria = new Map<string, number>();

  for (const entrada of recientes) {
    recientesPorClave.set(entrada.clave, (recientesPorClave.get(entrada.clave) ?? 0) + 1);
    recientesPorCategoria.set(entrada.categoria, (recientesPorCategoria.get(entrada.categoria) ?? 0) + 1);
  }

  const totalesPorEndpoint: Record<string, number> = {};
  for (const [clave, datos] of datosPorClave.entries()) {
    totalesPorEndpoint[clave] = datos.total;
  }

  const totalesCategorias: Record<string, number> = {};
  for (const [categoria, total] of totalesPorCategoria.entries()) {
    totalesCategorias[categoria] = total;
  }

  const rpmPorEndpoint: Record<string, number> = {};
  for (const [clave, conteo] of recientesPorClave.entries()) {
    rpmPorEndpoint[clave] = parseFloat((conteo / MINUTOS_VENTANA).toFixed(2));
  }

  const rpmPorCategoria: Record<string, number> = {};
  for (const [categoria, conteo] of recientesPorCategoria.entries()) {
    rpmPorCategoria[categoria] = parseFloat((conteo / MINUTOS_VENTANA).toFixed(2));
  }

  const duracionPromedioPorEndpoint: Record<string, number> = {};
  for (const [clave, datos] of datosPorClave.entries()) {
    duracionPromedioPorEndpoint[clave] = datos.duracionTotal / datos.total;
  }

  const contadorBD = await contadorConsultasBd.get();
  const consultasBdTotales = contadorBD.values?.reduce((acc, item) => acc + (item?.value ?? 0), 0) ?? 0;

  return {
    sistema: {
      uptime_segundos: process.uptime(),
      rutas_registradas: datosPorClave.size,
      categorias_registradas: totalesPorCategoria.size,
    },
    solicitudes_totales_por_endpoint: totalesPorEndpoint,
    solicitudes_totales_por_categoria: totalesCategorias,
    solicitudes_por_minuto_por_endpoint: rpmPorEndpoint,
    solicitudes_por_minuto_por_categoria: rpmPorCategoria,
    duracion_promedio_segundos_por_endpoint: duracionPromedioPorEndpoint,
    consultas_bd_totales: consultasBdTotales,
    ultima_actualizacion: new Date().toISOString(),
  };
}

// ─── Handler HTTP para el endpoint /metricas ──────────────────────────────────

export async function manejadorMetricas(req: any, res: any) {
  try {
    const metricas = await obtenerMetricasJSON();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(metricas);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo generar métricas', detalle: String(error) });
  }
}

export default registro;
