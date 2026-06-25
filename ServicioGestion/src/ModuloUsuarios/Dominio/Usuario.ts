export abstract class Usuario {
  protected id: string;
  protected cedula: string;
  protected nombre: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
  }

  obtenerId(): string {
    return this.id;
  }

  obtenerCedula(): string {
    return this.cedula;
  }

  obtenerNombre(): string {
    return this.nombre;
  }

  abstract obtenerRol(): string;
}