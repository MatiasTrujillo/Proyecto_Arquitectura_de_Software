import { Incidente } from "../Dominio/Incidente";
import { IRepositorioIncidente } from "../IDataAccess/IRepositorioIncidente";

export class RepositorioIncidente implements IRepositorioIncidente {
  private incidentes: Incidente[] = [];
  private proximoId: number = 1;

  crearIncidente(
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Incidente {
    const nuevoIncidente = new Incidente(
      this.proximoId.toString(),
      descripcion,
      fecha,
      reservaId,
      estado,
      severidad,
    );
    this.proximoId += 1;
    this.incidentes.push(nuevoIncidente);
    return nuevoIncidente;
  }

  obtenerIncidentes(): Incidente[] {
    return this.incidentes;
  }

  obtenerIncidentePorId(id: string): Incidente | undefined {
    return this.incidentes.find(incidente => incidente.getId() === id);
  }

  actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Incidente | undefined {
    let incidenteActualizado: Incidente | undefined;

    this.incidentes = this.incidentes.map(incidente => {
      if (incidente.getId() !== id) {
        return incidente;
      }

      incidenteActualizado = new Incidente(
        id,
        descripcion,
        fecha,
        reservaId,
        estado,
        severidad,
      );
      return incidenteActualizado;
    });

    return incidenteActualizado;
  }

  eliminarIncidente(id: string): boolean {
    const originalLength = this.incidentes.length;
    this.incidentes = this.incidentes.filter(incidente => incidente.getId() !== id);
    return this.incidentes.length !== originalLength;
  }

  existe(id: string): boolean {
    return this.incidentes.some(incidente => incidente.getId() === id);
  }
}
