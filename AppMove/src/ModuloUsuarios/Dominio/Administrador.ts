import { Usuario } from "./Usuario";

export class Administrador extends Usuario {
  constructor(id: string, cedula: string, nombre: string) {
    super(id, cedula, nombre);
  }

  obtenerRol(): string {
    return "Administrador";
  }
}