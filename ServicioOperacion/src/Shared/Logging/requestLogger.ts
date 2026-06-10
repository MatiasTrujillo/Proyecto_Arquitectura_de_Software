import { Request, Response, NextFunction } from 'express';
import registrador from './logger';
import { contadorSolicitudesHttp, histogramaDuracionSolicitudes, registrarSolicitudInterna } from '../Metrics/metrics';

/**
 * Middleware que se ejecuta en cada solicitud HTTP.
 * Espera a que la respuesta termine ('finish') para medir la duración real
 * y luego registra los datos en Prometheus y en las métricas internas.
 */
export function registradorSolicitudes(req: Request, res: Response, next: NextFunction) {
  const inicio = process.hrtime();

  res.on('finish', () => {
    const [segundos, nanosegundos] = process.hrtime(inicio);
    const duracionSegundos = segundos + nanosegundos / 1e9;

    // req.route?.path usa la ruta con parámetros (ej: /api/vehiculos/:id)
    // en vez de la ruta real (ej: /api/vehiculos/5), para poder agruparlas
    const ruta = req.route?.path ?? req.path;
    const metodo = req.method;
    const estado = res.statusCode;

    // Registrar en Prometheus
    contadorSolicitudesHttp.inc({ metodo, ruta, estado });
    histogramaDuracionSolicitudes.observe({ metodo, ruta, estado: String(estado) }, duracionSegundos);

    // Registrar en métricas internas (las que devuelve /metricas)
    registrarSolicitudInterna(metodo, ruta, duracionSegundos);

    // Log de la solicitud
    registrador.info('solicitud_http', {
      metodo,
      ruta: req.path,
      estado,
      duracionSegundos,
      consulta: req.query,
    });
  });

  next();
}

/**
 * Middleware de manejo de errores no capturados.
 * Express lo reconoce como manejador de errores por tener 4 parámetros.
 */
export function manejadorErrores(err: any, req: Request, res: Response, next: NextFunction) {
  registrador.error('error_http', {
    mensaje: err?.message || String(err),
    pila: err?.stack,
    ruta: req.path,
    metodo: req.method,
  });
  res.status(500).json({ error: 'internal' });
}