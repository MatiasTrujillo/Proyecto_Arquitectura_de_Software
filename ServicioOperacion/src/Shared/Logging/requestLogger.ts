import { Request, Response, NextFunction } from 'express';
import registrador from './logger';
import { contadorSolicitudesHttp, histogramaDuracionSolicitudes, registrarSolicitudInterna } from '../Metrics/metrics';

export function registradorSolicitudes(req: Request, res: Response, next: NextFunction) {
  const inicio = process.hrtime();
  res.on('finish', () => {
    const [segundos, nanosegundos] = process.hrtime(inicio);
    const duracionSegundos = segundos + nanosegundos / 1e9;
    const ruta = req.route?.path ?? req.path;

    contadorSolicitudesHttp.inc({ metodo: req.method, ruta, estado: res.statusCode });
    histogramaDuracionSolicitudes.observe({ metodo: req.method, ruta, estado: String(res.statusCode) }, duracionSegundos);
    registrarSolicitudInterna(ruta, duracionSegundos);

    registrador.info('solicitud_http', {
      metodo: req.method,
      ruta: req.path,
      estado: res.statusCode,
      duracionSegundos,
      consulta: req.query,
    });
  });
  next();
}

export function manejadorErrores(err: any, req: Request, res: Response, next: NextFunction) {
  registrador.error('error_http', { mensaje: err?.message || String(err), pila: err?.stack, ruta: req.path, metodo: req.method });
  res.status(500).json({ error: 'internal' });
}
