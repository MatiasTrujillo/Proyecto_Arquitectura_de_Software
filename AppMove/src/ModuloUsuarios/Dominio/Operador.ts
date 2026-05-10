import { Usuario } from "./Usuario";

export class Operador extends Usuario {
  constructor(id: string, cedula: string, nombre: string) {
    super(id, cedula, nombre);
  }

  obtenerRol(): string {
    return "Operador";
  }
}