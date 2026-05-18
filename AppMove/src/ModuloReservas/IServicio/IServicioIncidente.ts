import { Incidente } from "../Dominio/Incidente";

export interface IServicioIncidente {
  crearIncidente(
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Incidente;
  obtenerIncidentes(): Incidente[];
  obtenerIncidentePorId(id: string): Incidente;
  actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Incidente;
  eliminarIncidente(id: string): void;
}
