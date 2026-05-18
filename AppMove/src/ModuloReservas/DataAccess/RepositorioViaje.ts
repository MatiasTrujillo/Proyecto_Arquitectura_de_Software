import { Viaje } from "../Dominio/Viaje";
import { IRepositorioViaje } from "../IDataAccess/IRepositorioViaje";

export class RepositorioViaje implements IRepositorioViaje {
  private viajes: Viaje[] = [];
  private proximoId: number = 1;

  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Viaje {
    const nuevoViaje = new Viaje(
      this.proximoId.toString(),
      reservaId,
      origen,
      destino,
      fecha,
      estado,
      conductor,
    );
    this.proximoId += 1;
    this.viajes.push(nuevoViaje);
    return nuevoViaje;
  }

  obtenerViajes(): Viaje[] {
    return this.viajes;
  }

  obtenerViajePorId(id: string): Viaje | undefined {
    return this.viajes.find(viaje => viaje.getId() === id);
  }

  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Viaje | undefined {
    let viajeActualizado: Viaje | undefined;

    this.viajes = this.viajes.map(viaje => {
      if (viaje.getId() !== id) {
        return viaje;
      }

      viajeActualizado = new Viaje(
        id,
        reservaId,
        origen,
        destino,
        fecha,
        estado,
        conductor,
      );
      return viajeActualizado;
    });

    return viajeActualizado;
  }

  eliminarViaje(id: string): boolean {
    const originalLength = this.viajes.length;
    this.viajes = this.viajes.filter(viaje => viaje.getId() !== id);
    return this.viajes.length !== originalLength;
  }

  existe(id: string): boolean {
    return this.viajes.some(viaje => viaje.getId() === id);
  }
}
