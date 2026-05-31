import { Incidente } from "../Dominio/Incidente";

export interface IRepositorioIncidente {
  crearIncidente(
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Promise<Incidente>;
  obtenerIncidentes(): Promise<Incidente[]>;
  obtenerIncidentePorId(id: string): Promise<Incidente | undefined>;
  actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Promise<Incidente | undefined>;
  eliminarIncidente(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
