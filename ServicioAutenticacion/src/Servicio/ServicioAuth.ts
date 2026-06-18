import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RepositorioCredencial } from '../DataAccess/RepositorioCredencial';
import { RepositorioSesion } from '../DataAccess/RepositorioSesion';

const SALT_ROUNDS  = 10;
const JWT_SECRET   = process.env.JWT_SECRET   || 'clave-secreta-jwt-dev';
const JWT_EXPIRY   = process.env.JWT_EXPIRY   || '24h';

interface JwtPayload {
  cedula: string;
  rol:    string;
  exp:    number;
}

export class ServicioAuth {
  constructor(
    private repoCredencial: RepositorioCredencial,
    private repoSesion:     RepositorioSesion,
  ) {}

  async registrar(cedula: string, password: string, rol: string): Promise<void> {
    if (await this.repoCredencial.existe(cedula)) {
      throw new Error(`Ya existe una credencial para la cédula ${cedula}`);
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await this.repoCredencial.crear(cedula, passwordHash, rol);
  }

  async login(cedula: string, password: string): Promise<{ token: string; rol: string }> {
    const credencial = await this.repoCredencial.buscarPorCedula(cedula);
    if (!credencial || !credencial.activa) throw new Error('Credenciales inválidas');

    const passwordValida = await bcrypt.compare(password, credencial.passwordHash);
    if (!passwordValida) throw new Error('Credenciales inválidas');

    // Firmar JWT con cedula y rol — sin base de datos
    const token = jwt.sign(
      { cedula, rol: credencial.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY } as jwt.SignOptions
    );
    return { token, rol: credencial.rol };
  }

  async logout(token: string): Promise<void> {
    // Decodificar sin verificar para obtener la expiración del token
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload) throw new Error('Token inválido');
    const expiraEn = new Date(payload.exp * 1000);
    await this.repoSesion.revocar(token, payload.cedula, expiraEn);
  }

  async verificar(token: string): Promise<{ cedula: string; rol: string } | null> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      // Comprobar si el usuario hizo logout (token en lista negra)
      if (await this.repoSesion.estaRevocado(token)) return null;
      return { cedula: payload.cedula, rol: payload.rol };
    } catch {
      return null;
    }
  }
}
