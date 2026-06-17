import { ZonaGeografica } from "../Dominio/ZonaGeografica";

export class ZonaGeograficaDTO {
  id: string;
  nombre: string;
  delimitacionGeografica: string;
  tipo: string;

  constructor(id: string, nombre: string, delimitacionGeografica: string, tipo: string) {
    this.id = id;
    this.nombre = nombre;
    this.delimitacionGeografica = delimitacionGeografica;
    this.tipo = tipo;
  }

  static fromEntity(entidad: ZonaGeografica): ZonaGeograficaDTO {
    return new ZonaGeograficaDTO(
      entidad.getId(),
      entidad.getNombre(),
      entidad.getDelimitacionGeografica(),
      entidad.getTipo()
    );
  }
}
