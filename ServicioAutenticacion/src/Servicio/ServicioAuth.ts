import bcrypt from 'bcrypt';
import { RepositorioCredencial } from '../DataAccess/RepositorioCredencial';
import { RepositorioSesion } from '../DataAccess/RepositorioSesion';

const SALT_ROUNDS = 10;

export class ServicioAuth {
  constructor(
    private repoCredencial: RepositorioCredencial,
    private repoSesion: RepositorioSesion,
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
    if (!credencial || !credencial.activa) {
      throw new Error('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(password, credencial.passwordHash);
    if (!passwordValida) {
      throw new Error('Credenciales inválidas');
    }

    const sesion = await this.repoSesion.crear(cedula, credencial.rol);
    return { token: sesion.token, rol: credencial.rol };
  }

  async logout(token: string): Promise<void> {
    const sesion = await this.repoSesion.buscarPorToken(token);
    if (!sesion) {
      throw new Error('Sesión no encontrada');
    }
    await this.repoSesion.desactivar(token);
  }

  async verificar(token: string): Promise<{ cedula: string; rol: string } | null> {
    const sesion = await this.repoSesion.buscarPorToken(token);
    if (!sesion || !sesion.activa) return null;
    if (sesion.expiraEn && sesion.expiraEn < new Date()) return null;
    return { cedula: sesion.cedula, rol: sesion.rol };
  }
}
