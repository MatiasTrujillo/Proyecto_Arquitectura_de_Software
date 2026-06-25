import { Usuario } from "./Usuario";

export class Administrador extends Usuario {
  private email: string | null;

  constructor(id: string, cedula: string, nombre: string, email?: string | null) {
    super(id, cedula, nombre);
    this.email = email ?? null;
  }

  obtenerEmail(): string | null { return this.email; }

  obtenerRol(): string {
    return "Administrador";
  }
}