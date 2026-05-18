import { Incidente } from "../Dominio/Incidente";

export interface IRepositorioIncidente {
  crearIncidente(
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Incidente;
  obtenerIncidentes(): Incidente[];
  obtenerIncidentePorId(id: string): Incidente | undefined;
  actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Incidente | undefined;
  eliminarIncidente(id: string): boolean;
  existe(id: string): boolean;
}
