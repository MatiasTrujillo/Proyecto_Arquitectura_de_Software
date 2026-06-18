import { Request, Response, NextFunction } from 'express';
import registrador from '../Logging/logger';

const URL_AUTH              = process.env.AUTH_SERVICE_URL       || 'http://localhost:3002';
const INTERNAL_SERVICE_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || '';

const ACCESO_POR_PREFIJO: Record<string, string[]> = {
  '/administradores': ['Administrador'],
  '/operadores':      ['Operador', 'Administrador'],
  '/conductores':     ['Conductor', 'Administrador', 'Operador'],
  '/clientes-personales':    ['ClientePersonal', 'Administrador'],
  '/clientes-empresariales': ['ClienteEmpresa', 'Administrador'],
  '/productos':          ['Administrador', 'ClienteEmpresa'],
  '/vehiculos':          ['Administrador'],
  '/zonas-geograficas':  ['Administrador'],
  '/pagos':              ['Administrador'],
  '/reservas':           ['Administrador', 'Operador'],
  '/viajes':             ['Administrador', 'Operador', 'Conductor'],
  '/incidentes':         ['Administrador', 'Operador', 'Conductor'],
};

// Rutas donde solo el Administrador puede hacer la operación,
// independientemente de lo que permita el prefijo general.
const SOLO_ADMIN_EXACTO: Array<{ metodo: string; ruta: string }> = [
  { metodo: 'POST',   ruta: '/clientes-personales' },
  { metodo: 'POST',   ruta: '/clientes-empresariales' },
  { metodo: 'POST',   ruta: '/conductores' },
];

// Operador puede leer conductores pero no modificarlos
const OPERADOR_SOLO_LECTURA_PREFIJOS = ['/conductores'];

export async function verificarAutorizacion(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    registrador.warn('acceso_no_autorizado', {
      motivo: 'token_ausente',
      ruta: req.path,
      metodo: req.method,
      ip: req.ip,
    });
    res.status(401).json({ error: 'Token requerido. Incluí Authorization: Bearer {token}' });
    return;
  }

  const token = authHeader.substring(7);

  // Token de servicio interno: acceso total sin llamar al auth service
  if (INTERNAL_SERVICE_TOKEN && token === INTERNAL_SERVICE_TOKEN) {
    (req as any).usuario = { cedula: 'sistema', rol: 'Administrador' };
    next();
    return;
  }

  try {
    const respuesta = await fetch(`${URL_AUTH}/api/auth/verificar`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!respuesta.ok) {
      registrador.warn('acceso_no_autorizado', {
        motivo: 'token_invalido_o_expirado',
        ruta: req.path,
        metodo: req.method,
        ip: req.ip,
      });
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }

    const usuario = await respuesta.json() as { cedula: string; rol: string };
    (req as any).usuario = usuario;

    // Operador no puede modificar conductores
    const esSoloLectura = OPERADOR_SOLO_LECTURA_PREFIJOS.some(p => req.path.startsWith(p));
    if (esSoloLectura && usuario.rol === 'Operador' && req.method !== 'GET') {
      res.status(403).json({ error: `El rol 'Operador' solo puede consultar este recurso` });
      return;
    }

    const esRutaSoloAdmin = SOLO_ADMIN_EXACTO.some(
      r => r.metodo === req.method && r.ruta === req.path
    );
    if (esRutaSoloAdmin && usuario.rol !== 'Administrador') {
      registrador.warn('acceso_denegado_por_rol', {
        cedula: usuario.cedula,
        rol: usuario.rol,
        ruta: req.path,
        metodo: req.method,
      });
      res.status(403).json({ error: `El rol '${usuario.rol}' no tiene permiso para crear usuarios` });
      return;
    }

    const prefijo = Object.keys(ACCESO_POR_PREFIJO).find(p => req.path.startsWith(p));
    if (prefijo) {
      const rolesPermitidos = ACCESO_POR_PREFIJO[prefijo];
      if (!rolesPermitidos.includes(usuario.rol)) {
        registrador.warn('acceso_denegado_por_rol', {
          cedula: usuario.cedula,
          rol: usuario.rol,
          ruta: req.path,
          metodo: req.method,
        });
        res.status(403).json({ error: `El rol '${usuario.rol}' no tiene permiso para acceder a este recurso` });
        return;
      }
    }

    registrador.info('acceso_autorizado', {
      cedula: usuario.cedula,
      rol: usuario.rol,
      ruta: req.path,
      metodo: req.method,
    });

    next();
  } catch {
    registrador.error('error_servicio_auth', {
      ruta: req.path,
      metodo: req.method,
      detalle: 'ServicioAutenticacion no disponible',
    });
    res.status(503).json({ error: 'Servicio de autenticación no disponible' });
  }
}
