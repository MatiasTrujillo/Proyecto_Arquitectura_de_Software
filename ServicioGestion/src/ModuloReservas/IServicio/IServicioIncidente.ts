import { IncidenteDTO } from "../DTOs/IncidenteDTO";

export interface IServicioIncidente {
  crearIncidente(descripcion: string, fecha: string | Date, reservaId: string, estado: string, severidad: string, conductorId: string): Promise<IncidenteDTO>;
  obtenerIncidentes(): Promise<IncidenteDTO[]>;
  obtenerIncidentePorId(id: string): Promise<IncidenteDTO>;
  actualizarIncidente(id: string, descripcion: string, fecha: string | Date, reservaId: string, estado: string, severidad: string, conductorId: string): Promise<IncidenteDTO>;
  eliminarIncidente(id: string): Promise<void>;
}
