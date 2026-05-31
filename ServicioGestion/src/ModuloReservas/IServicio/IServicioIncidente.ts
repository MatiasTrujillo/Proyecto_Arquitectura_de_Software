import { IncidenteDTO } from "../DTOs/IncidenteDTO";

export interface IServicioIncidente {
  crearIncidente(
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): IncidenteDTO;
  obtenerIncidentes(): IncidenteDTO[];
  obtenerIncidentePorId(id: string): IncidenteDTO;
  actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): IncidenteDTO;
  eliminarIncidente(id: string): void;
}
