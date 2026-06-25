import { Request, Response } from 'express';
import { ServicioAuth } from '../Servicio/ServicioAuth';
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
        'Content-Type':  'application/json',
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
    this.servicio = new ServicioAuth(new RepositorioSesion());
  }

  // ── F1: Registro de clientes (crea en Auth0 + sincroniza con ServicioGestion) ──

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, nombre, email, password, rol } = req.body;
      if (!cedula || !nombre || !email || !password || !rol) {
        res.status(400).json({ error: 'cedula, nombre, email, password y rol son requeridos' });
        return;
      }
      if (!ROLES_PUBLICOS.includes(rol)) {
        res.status(403).json({ error: `El registro de '${rol}' lo gestiona el administrador del sistema` });
        return;
      }

      const existe = await this.servicio.existeUsuarioEnAuth0(email);
      if (existe) {
        res.status(400).json({ error: `Ya existe un usuario con el email ${email}` });
        return;
      }

      await this.servicio.crearUsuarioEnAuth0(email, password, cedula, rol);
      registrador.info('usuario_registrado_auth0', { cedula, rol, email });

      await sincronizarConGestion(cedula, nombre, rol);
      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      registrador.error('error_registro', { mensaje });
      res.status(400).json({ error: mensaje });
    }
  }

  // Llamado internamente por ServicioGestion cuando el admin crea conductores/operadores/admins
  async registrarInterno(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, password, rol } = req.body;
      if (!cedula || !password || !rol) {
        res.status(400).json({ error: 'cedula, password y rol son requeridos' });
        return;
      }
      const email = `${cedula}@move.internal`;
      const existe = await this.servicio.existeUsuarioEnAuth0(email);
      if (!existe) {
        await this.servicio.crearUsuarioEnAuth0(email, password, cedula, rol);
      }
      registrador.info('usuario_interno_registrado', { cedula, rol });
      res.status(201).json({ mensaje: 'Credencial creada' });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: mensaje });
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
        res.status(401).json({ error: 'Token requerido' });
        return;
      }
      const token = authHeader.substring(7);
      const usuario = await this.servicio.verificar(token);
      if (!usuario) {
        res.status(401).json({ error: 'Token inválido o expirado' });
        return;
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar el token' });
    }
  }

  // ── Token de prueba para carga (solo TEST_MODE=true) ─────────────────────────

  generarTokenTest(req: Request, res: Response): void {
    const { cedula, rol } = req.body;
    if (!cedula || !rol) {
      res.status(400).json({ error: 'cedula y rol son requeridos' });
      return;
    }
    const resultado = this.servicio.emitirTokenOAuth(String(cedula), String(rol));
    res.status(200).json(resultado);
  }

  // ── OAuth 2.0 con Auth0 ──────────────────────────────────────────────────────

  iniciarOAuth(_req: Request, res: Response): void {
    const domain   = process.env.AUTH0_DOMAIN       || '';
    const clientId = process.env.AUTH0_CLIENT_ID    || '';
    const callback = process.env.AUTH0_CALLBACK_URL || 'http://localhost:3002/api/auth/callback';

    if (!domain || !clientId) {
      res.status(503).send('Auth0 no está configurado. Completá las variables AUTH0_* en el .env');
      return;
    }

    const url = `https://${domain}/authorize?` + new URLSearchParams({
      response_type: 'code',
      client_id:     clientId,
      redirect_uri:  callback,
      scope:         'openid profile email',
      prompt:        'login',
    }).toString();

    res.redirect(url);
  }

  async callbackOAuth(req: Request, res: Response): Promise<void> {
    const { code, error } = req.query as Record<string, string>;

    if (error) {
      // Si el usuario rechazó o canceló, volver al inicio para que pueda intentar con otro usuario
      if (error === 'access_denied' || error === 'login_required') {
        res.redirect('/');
        return;
      }
      res.status(401).send(`Auth0 rechazó el acceso: ${error}`);
      return;
    }
    if (!code) {
      res.status(400).send('Código de autorización faltante');
      return;
    }

    const domain       = process.env.AUTH0_DOMAIN        || '';
    const clientId     = process.env.AUTH0_CLIENT_ID     || '';
    const clientSecret = process.env.AUTH0_CLIENT_SECRET || '';
    const callback     = process.env.AUTH0_CALLBACK_URL  || 'http://localhost:3002/api/auth/callback';
    const namespace    = process.env.AUTH0_NAMESPACE     || 'https://move.app';

    try {
      const tokenRes = await fetch(`https://${domain}/oauth/token`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          grant_type:    'authorization_code',
          client_id:     clientId,
          client_secret: clientSecret,
          code,
          redirect_uri:  callback,
        }),
      });

      const tokens: any = await tokenRes.json();
      if (!tokens.id_token) {
        registrador.warn('auth0_callback_sin_token', { detalle: tokens.error_description });
        res.status(401).send('Autenticación con Auth0 fallida. Intentá de nuevo.');
        return;
      }

      const raw     = tokens.id_token.split('.')[1];
      const padded  = raw + '='.repeat((4 - raw.length % 4) % 4);
      const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));

      const cedula = payload[`${namespace}/cedula`] as string | undefined;
      const rol    = payload[`${namespace}/rol`]    as string | undefined;

      if (!cedula || !rol) {
        registrador.warn('auth0_usuario_sin_cedula_rol', { sub: payload.sub });
        res.status(401).send('El usuario de Auth0 no tiene cédula o rol asignados. Contactá al administrador.');
        return;
      }

      const { token } = this.servicio.emitirTokenOAuth(cedula, rol);
      registrador.info('login_oauth_exitoso', { cedula, rol, ip: req.ip });

      const paginas: Record<string, string> = {
        Administrador:   'http://localhost:3001/',
        Operador:        'http://localhost:3001/',
        Conductor:       'http://localhost:3001/',
        ClientePersonal: 'http://localhost:3001/',
        ClienteEmpresa:  'http://localhost:3001/',
      };
      const destino = paginas[rol] ?? 'http://localhost:3001/';
      res.redirect(`${destino}?token=${encodeURIComponent(token)}&rol=${encodeURIComponent(rol)}`);

    } catch (e) {
      registrador.error('error_callback_oauth', { error: String(e) });
      res.status(500).send('Error interno al procesar el callback de Auth0.');
    }
  }
}
