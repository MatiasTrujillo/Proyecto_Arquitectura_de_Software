import { Request, Response } from 'express';
import { ServicioAuth } from '../Servicio/ServicioAuth';
import { RepositorioCredencial } from '../DataAccess/RepositorioCredencial';
import { RepositorioSesion } from '../DataAccess/RepositorioSesion';
import registrador from '../Shared/Logging/logger';

const GESTION_URL            = process.env.GESTION_URL            || 'http://localhost:3001';
const INTERNAL_SERVICE_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || '';

const ROLES_PUBLICOS = ['ClientePersonal', 'ClienteEmpresa'];

const ENDPOINT_POR_ROL: Record<string, string> = {
  ClientePersonal: '/api/clientes-personales',
  ClienteEmpresa:  '/api/clientes-empresariales',
  Conductor:       '/api/conductores',
  Operador:        '/api/operadores',
  Administrador:   '/api/administradores',
};

async function sincronizarConGestion(cedula: string, nombre: string, rol: string): Promise<void> {
  const endpoint = ENDPOINT_POR_ROL[rol];
  if (!endpoint) return;
  try {
    const res = await fetch(`${GESTION_URL}${endpoint}`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTERNAL_SERVICE_TOKEN}`,
      },
      body: JSON.stringify({ cedula, nombre }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      registrador.warn('sincronizacion_gestion_fallida', { cedula, rol, status: res.status, error: (err as any).error });
    }
  } catch (e) {
    registrador.warn('sincronizacion_gestion_error_red', { cedula, rol, detalle: String(e) });
  }
}

export class ControladorAuth {
  private servicio: ServicioAuth;

  constructor() {
    this.servicio = new ServicioAuth(
      new RepositorioCredencial(),
      new RepositorioSesion(),
    );
  }

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, password, rol, nombre } = req.body;
      if (!cedula || !password || !rol || !nombre) {
        res.status(400).json({ error: 'cedula, nombre, password y rol son requeridos' });
        return;
      }
      if (!ROLES_PUBLICOS.includes(rol)) {
        res.status(403).json({ error: `El registro de '${rol}' lo gestiona el administrador del sistema` });
        return;
      }
      await this.servicio.registrar(cedula, password, rol);
      registrador.info('credencial_registrada', { cedula, rol });
      await sincronizarConGestion(cedula, nombre, rol);
      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      registrador.error('error_registro', { mensaje });
      res.status(400).json({ error: mensaje });
    }
  }

  // Llamado internamente por ServicioGestion cuando el admin crea un conductor/operador/admin
  async registrarInterno(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, password, rol } = req.body;
      if (!cedula || !password || !rol) {
        res.status(400).json({ error: 'cedula, password y rol son requeridos' });
        return;
      }
      await this.servicio.registrar(cedula, password, rol);
      registrador.info('credencial_registrada_interna', { cedula, rol });
      res.status(201).json({ mensaje: 'Credencial creada' });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: mensaje });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, password } = req.body;
      if (!cedula || !password) {
        res.status(400).json({ error: 'cedula y password son requeridos' });
        return;
      }
      const { token, rol } = await this.servicio.login(cedula, password);
      registrador.info('login_exitoso', { cedula, ip: req.ip });
      res.status(200).json({ token, rol });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      registrador.warn('login_fallido', { cedula: req.body?.cedula, ip: req.ip, motivo: mensaje });
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        res.status(400).json({ error: 'token es requerido' });
        return;
      }
      await this.servicio.logout(token);
      registrador.info('logout_exitoso', { token });
      res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: mensaje });
    }
  }

  async verificar(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        registrador.warn('verificacion_fallida', { motivo: 'token_ausente', ip: req.ip });
        res.status(401).json({ error: 'Token requerido' });
        return;
      }

      const token = authHeader.substring(7);
      const usuario = await this.servicio.verificar(token);

      if (!usuario) {
        registrador.warn('verificacion_fallida', { motivo: 'token_invalido_o_expirado', ip: req.ip });
        res.status(401).json({ error: 'Token inválido o expirado' });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      registrador.error('error_verificacion', { mensaje });
      res.status(500).json({ error: 'Error al verificar el token' });
    }
  }
}
