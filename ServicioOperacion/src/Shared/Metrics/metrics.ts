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
  clave: string;      // Ej: "GET /api/vehiculos/:id"
  categoria: string;  // Ej: "vehiculos"
  timestamp: number;
}

interface DatosPorClave {
  total: number;
  duracionTotal: number;
}

// ─── Almacenamiento interno ───────────────────────────────────────────────────

// Acumula totales por "METODO /ruta"
const datosPorClave = new Map<string, DatosPorClave>();

// Acumula totales por categoría (ej: "vehiculos", "dispositivos", "general")
const totalesPorCategoria = new Map<string, number>();

// Historial de los últimos N minutos para calcular solicitudes por minuto
const historial: EntradaSolicitud[] = [];

// ─── Funciones auxiliares ─────────────────────────────────────────────────────

/**
 * Extrae la categoría de una ruta.
 * Ej: "/api/vehiculos/:id" → "vehiculos"
 *     "/metricas-ui"       → "general"
 */
function obtenerCategoria(ruta: string): string {
  const coincidencia = ruta.match(/^\/api\/([^\/]+)/);
  return coincidencia ? coincidencia[1] : 'general';
}

/**
 * Elimina del historial las entradas más antiguas que la ventana de tiempo dada.
 * Devuelve las entradas que quedan (las recientes).
 */
function limpiarHistorialAntiguo(ventanaMs: number): EntradaSolicitud[] {
  const limite = Date.now() - ventanaMs;
  const recientes = historial.filter(entrada => entrada.timestamp >= limite);
  historial.length = 0;
  historial.push(...recientes);
  return recientes;
}

// ─── Función principal de registro ───────────────────────────────────────────

/**
 * Registra una solicitud HTTP en las estructuras internas.
 * La clave que se guarda es "METODO /ruta", por ejemplo "DELETE /api/vehiculos/:id".
 */
export function registrarSolicitudInterna(metodo: string, ruta: string, duracionSegundos: number) {
  const clave = `${metodo} ${ruta}`;
  const categoria = obtenerCategoria(ruta);

  // Actualizar totales por clave
  const datosPrevios = datosPorClave.get(clave) ?? { total: 0, duracionTotal: 0 };
  datosPorClave.set(clave, {
    total: datosPrevios.total + 1,
    duracionTotal: datosPrevios.duracionTotal + duracionSegundos,
  });

  // Actualizar totales por categoría
  totalesPorCategoria.set(categoria, (totalesPorCategoria.get(categoria) ?? 0) + 1);

  // Guardar en historial para cálculo de RPM
  historial.push({ clave, categoria, timestamp: Date.now() });
}

// ─── Generación del JSON de métricas ─────────────────────────────────────────

export async function obtenerMetricasJSON() {
  const VENTANA_MS = 5 * 60 * 1000; // ventana de 5 minutos para el cálculo de RPM
  const MINUTOS_VENTANA = 5;

  const recientes = limpiarHistorialAntiguo(VENTANA_MS);

  // Contar solicitudes recientes por clave y categoría (para RPM)
  const recientesPorClave = new Map<string, number>();
  const recientesPorCategoria = new Map<string, number>();

  for (const entrada of recientes) {
    recientesPorClave.set(entrada.clave, (recientesPorClave.get(entrada.clave) ?? 0) + 1);
    recientesPorCategoria.set(entrada.categoria, (recientesPorCategoria.get(entrada.categoria) ?? 0) + 1);
  }

  // Construir objeto de totales por endpoint
  const totalesPorEndpoint: Record<string, number> = {};
  for (const [clave, datos] of datosPorClave.entries()) {
    totalesPorEndpoint[clave] = datos.total;
  }

  // Construir objeto de totales por categoría
  const totalesCategorias: Record<string, number> = {};
  for (const [categoria, total] of totalesPorCategoria.entries()) {
    totalesCategorias[categoria] = total;
  }

  // Construir objeto de RPM por endpoint
  const rpmPorEndpoint: Record<string, number> = {};
  for (const [clave, conteo] of recientesPorClave.entries()) {
    rpmPorEndpoint[clave] = parseFloat((conteo / MINUTOS_VENTANA).toFixed(2));
  }

  // Construir objeto de RPM por categoría
  const rpmPorCategoria: Record<string, number> = {};
  for (const [categoria, conteo] of recientesPorCategoria.entries()) {
    rpmPorCategoria[categoria] = parseFloat((conteo / MINUTOS_VENTANA).toFixed(2));
  }

  // Construir objeto de duración promedio por endpoint
  const duracionPromedioPorEndpoint: Record<string, number> = {};
  for (const [clave, datos] of datosPorClave.entries()) {
    duracionPromedioPorEndpoint[clave] = datos.duracionTotal / datos.total;
  }

  // Obtener total de consultas a la BD desde Prometheus
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