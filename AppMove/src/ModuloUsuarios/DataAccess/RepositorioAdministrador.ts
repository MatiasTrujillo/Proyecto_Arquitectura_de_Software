import { Administrador } from "../Dominio/Administrador";
import { IRepositorioAdministrador } from "../IDataAccess/IRepositorioAdministrador";

export class RepositorioAdministrador implements IRepositorioAdministrador {
  private administradores: Administrador[] = [];
  private siguienteId: number = 1;

  crearAdministrador(cedula: string, nombre: string): Administrador {
    const nuevoAdministrador = new Administrador(String(this.siguienteId++), cedula, nombre);
    this.administradores.push(nuevoAdministrador);
    return nuevoAdministrador;
  }

  obtenerAdministradores(): Administrador[] {
    return this.administradores;
  }

  obtenerAdministradorPorId(id: string): Administrador | undefined {
    return this.administradores.find(administrador => administrador.getId() === id);
  }

  actualizarAdministrador(id: string, cedula: string, nombre: string): Administrador | undefined {
    const index = this.administradores.findIndex(administrador => administrador.getId() === id);

    if (index === -1) {
      return undefined;
    }

    const administradorActualizado = new Administrador(id, cedula, nombre);
    this.administradores[index] = administradorActualizado;
    return administradorActualizado;
  }

  eliminarAdministrador(id: string): boolean {
    const index = this.administradores.findIndex(administrador => administrador.getId() === id);

    if (index === -1) {
      return false;
    }

    this.administradores.splice(index, 1);
    return true;
  }

  existe(id: string): boolean {
    return this.administradores.some(administrador => administrador.getId() === id);
  }
}
