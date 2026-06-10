import { Request, Response, NextFunction } from 'express';
import registrador from './logger';
import { contadorSolicitudesHttp, histogramaDuracionSolicitudes, registrarSolicitudInterna } from '../Metrics/metrics';

export function registradorSolicitudes(req: Request, res: Response, next: NextFunction) {
  const inicio = process.hrtime();

  res.on('finish', () => {
    const [segundos, nanosegundos] = process.hrtime(inicio);
    const duracionSegundos = segundos + nanosegundos / 1e9;

    const ruta = req.route?.path ?? req.path;
    const metodo = req.method;
    const estado = res.statusCode;

    contadorSolicitudesHttp.inc({ metodo, ruta, estado });
    histogramaDuracionSolicitudes.observe({ metodo, ruta, estado: String(estado) }, duracionSegundos);

    registrarSolicitudInterna(metodo, ruta, duracionSegundos);

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

export function manejadorErrores(err: any, req: Request, res: Response, next: NextFunction) {
  registrador.error('error_http', {
    mensaje: err?.message || String(err),
    pila: err?.stack,
    ruta: req.path,
    metodo: req.method,
  });
  res.status(500).json({ error: 'internal' });
}
