export class ZonaGeograficaDTO {
  id: number;
  nombre: string;
  delimitacionGeografica: string;

  constructor(id: number, nombre: string, delimitacionGeografica: string) {
    this.id = id;
    this.nombre = nombre;
    this.delimitacionGeografica = delimitacionGeografica;
  }
}
