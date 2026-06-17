import client from 'prom-client';

const registro = new client.Registry();
client.collectDefaultMetrics({ register: registro });

export const contadorSolicitudesHttp = new client.Counter({
  name: 'solicitudes_http_totales',
  help: 'Cantidad total de solicitudes HTTP',
  labelNames: ['metodo', 'ruta', 'estado'],
  registers: [registro]
});

export const contadorConsultasBd = new client.Counter({
  name: 'consultas_bd_totales',
  help: 'Cantidad total de consultas a la base de datos',
  registers: [registro]
});

export const histogramaDuracionSolicitudes = new client.Histogram({
  name: 'duracion_solicitudes_http_segundos',
  help: 'Duración de solicitudes HTTP en segundos',
  labelNames: ['metodo', 'ruta', 'estado'],
  registers: [registro],
  buckets: [0.001, 0.01, 0.1, 1, 5]
});

export const histogramaDuracionConsultasBd = new client.Histogram({
  name: 'duracion_consultas_bd_segundos',
  help: 'Duración de consultas a la BD en segundos',
  registers: [registro],
  buckets: [0.0005, 0.001, 0.005, 0.01, 0.1, 1]
});

const solicitudesPorRuta = new Map<string, number>();
const solicitudesPorCategoria = new Map<string, number>();
const duracionTotalPorRuta = new Map<string, number>();
const conteoDuracionPorRuta = new Map<string, number>();
const historialSolicitudes: Array<{ ruta: string; categoria: string; timestamp: number }> = [];

function obtenerCategoria(ruta: string): string {
  const coincidencia = ruta.match(/^\/api\/([^\/]+)/);
  return coincidencia ? coincidencia[1] : 'general';
}

export function registrarSolicitudInterna(ruta: string, duracionSegundos: number) {
  const categoria = obtenerCategoria(ruta);
  const ahora = Date.now();

  solicitudesPorRuta.set(ruta, (solicitudesPorRuta.get(ruta) ?? 0) + 1);
  solicitudesPorCategoria.set(categoria, (solicitudesPorCategoria.get(categoria) ?? 0) + 1);
  duracionTotalPorRuta.set(ruta, (duracionTotalPorRuta.get(ruta) ?? 0) + duracionSegundos);
  conteoDuracionPorRuta.set(ruta, (conteoDuracionPorRuta.get(ruta) ?? 0) + 1);
  historialSolicitudes.push({ ruta, categoria, timestamp: ahora });
}

function limpiarHistorialAntiguo(ventanaMs: number) {
  const limite = Date.now() - ventanaMs;
  const recientes = historialSolicitudes.filter(registro => registro.timestamp >= limite);
  historialSolicitudes.length = 0;
  historialSolicitudes.push(...recientes);
  return recientes;
}

export async function obtenerMetricasJSON() {
  const ventanaMs = 5 * 60 * 1000; // 5 minutos
  const recientes = limpiarHistorialAntiguo(ventanaMs);
  const solicitudesPorMinutoPorRuta = new Map<string, number>();
  const solicitudesPorMinutoPorCategoria = new Map<string, number>();

  recientes.forEach(({ ruta, categoria }) => {
    solicitudesPorMinutoPorRuta.set(ruta, (solicitudesPorMinutoPorRuta.get(ruta) ?? 0) + 1);
    solicitudesPorMinutoPorCategoria.set(categoria, (solicitudesPorMinutoPorCategoria.get(categoria) ?? 0) + 1);
  });

  const promedioDuracionPorRuta: Record<string, number> = {};
  for (const [ruta, total] of duracionTotalPorRuta.entries()) {
    const conteo = conteoDuracionPorRuta.get(ruta) ?? 1;
    promedioDuracionPorRuta[ruta] = total / conteo;
  }

  const requestsByEndpoint: Record<string, number> = {};
  solicitudesPorRuta.forEach((valor, ruta) => { requestsByEndpoint[ruta] = valor; });

  const requestsByCategory: Record<string, number> = {};
  solicitudesPorCategoria.forEach((valor, categoria) => { requestsByCategory[categoria] = valor; });

  const rpmByEndpoint: Record<string, number> = {};
  solicitudesPorMinutoPorRuta.forEach((valor, ruta) => { rpmByEndpoint[ruta] = parseFloat((valor / 5).toFixed(2)); });

  const rpmByCategory: Record<string, number> = {};
  solicitudesPorMinutoPorCategoria.forEach((valor, categoria) => { rpmByCategory[categoria] = parseFloat((valor / 5).toFixed(2)); });

  const contadorBD = await contadorConsultasBd.get();
  const consultasBdTotales = contadorBD.values?.reduce((acc, item) => acc + (item?.value ?? 0), 0) ?? 0;

  return {
    sistema: {
      uptime_segundos: process.uptime(),
      rutas_registradas: Array.from(solicitudesPorRuta.keys()).length,
      categorias_registradas: Array.from(solicitudesPorCategoria.keys()).length,
    },
    solicitudes_totales_por_endpoint: requestsByEndpoint,
    solicitudes_totales_por_categoria: requestsByCategory,
    solicitudes_por_minuto_por_endpoint: rpmByEndpoint,
    solicitudes_por_minuto_por_categoria: rpmByCategory,
    duracion_promedio_segundos_por_endpoint: promedioDuracionPorRuta,
    consultas_bd_totales: consultasBdTotales,
    ultima_actualizacion: new Date().toISOString(),
  };
}

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
