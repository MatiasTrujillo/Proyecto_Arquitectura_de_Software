export abstract class Usuario {
  protected id: string;
  protected cedula: string;
  protected nombre: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
  }

  getId(): string {
    return this.id;
  }

  getCedula(): string {
    return this.cedula;
  }

  getNombre(): string {
    return this.nombre;
  }

  abstract obtenerRol(): string;
}