import jwt from 'jsonwebtoken';
import { RepositorioSesion } from '../DataAccess/RepositorioSesion';

const JWT_SECRET          = process.env.JWT_SECRET          || 'clave-secreta-jwt-dev';
const JWT_EXPIRY          = process.env.JWT_EXPIRY          || '24h';
const AUTH0_DOMAIN        = process.env.AUTH0_DOMAIN        || '';
const AUTH0_CLIENT_ID     = process.env.AUTH0_CLIENT_ID     || '';
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || '';

interface JwtPayload { cedula: string; rol: string; exp: number; }

export class ServicioAuth {
  constructor(private repoSesion: RepositorioSesion) {}

  // Emite JWT propio tras autenticación exitosa con Auth0
  emitirTokenOAuth(cedula: string, rol: string): { token: string; rol: string } {
    const token = jwt.sign(
      { cedula, rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY } as jwt.SignOptions
    );
    return { token, rol };
  }

  // Crea usuario en Auth0 via Management API
  async crearUsuarioEnAuth0(email: string, password: string, cedula: string, rol: string): Promise<void> {
    const mgmtToken = await this.obtenerTokenManagement();

    const res = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mgmtToken}`,
      },
      body: JSON.stringify({
        connection: 'Username-Password-Authentication',
        email,
        password,
        user_metadata: { cedula, rol },
      }),
    });

    if (!res.ok) {
      const err: any = await res.json();
      throw new Error(err.message || `Error Auth0 al crear usuario (${res.status})`);
    }
  }

  async existeUsuarioEnAuth0(email: string): Promise<boolean> {
    const mgmtToken = await this.obtenerTokenManagement();
    const res = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(email)}`,
      { headers: { 'Authorization': `Bearer ${mgmtToken}` } }
    );
    const users: any[] = await res.json();
    return Array.isArray(users) && users.length > 0;
  }

  private async obtenerTokenManagement(): Promise<string> {
    const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type:    'client_credentials',
        client_id:     AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience:      `https://${AUTH0_DOMAIN}/api/v2/`,
      }),
    });
    const data: any = await res.json();
    if (!data.access_token) throw new Error('No se pudo obtener token de Auth0 Management API');
    return data.access_token;
  }

  async logout(token: string): Promise<void> {
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload) throw new Error('Token inválido');
    const expiraEn = new Date(payload.exp * 1000);
    await this.repoSesion.revocar(token, payload.cedula, expiraEn);
  }

  async verificar(token: string): Promise<{ cedula: string; rol: string } | null> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      if (await this.repoSesion.estaRevocado(token)) return null;
      return { cedula: payload.cedula, rol: payload.rol };
    } catch {
      return null;
    }
  }
}
