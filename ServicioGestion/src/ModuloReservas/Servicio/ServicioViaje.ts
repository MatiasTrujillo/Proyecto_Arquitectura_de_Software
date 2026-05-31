import { IRepositorioViaje } from "../IDataAccess/IRepositorioViaje";
import { IServicioViaje } from "../IServicio/IServicioViaje";
import { ViajeDTO } from "../DTOs/ViajeDTO";

export class ServicioViaje implements IServicioViaje {
  constructor(private repositorio: IRepositorioViaje) {}

  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): ViajeDTO {
    const reservaIdValido = this.validarTexto(reservaId, "ReservaId");
    const origenValido = this.validarTexto(origen, "Origen");
    const destinoValido = this.validarTexto(destino, "Destino");
    const fechaValida = this.validarFecha(fecha);
    const estadoValido = this.validarTexto(estado, "Estado");
    const conductorValido = this.validarTexto(conductor, "Conductor");

    const viaje = this.repositorio.crearViaje(
      reservaIdValido,
      origenValido,
      destinoValido,
      fechaValida,
      estadoValido,
      conductorValido,
    );

    return ViajeDTO.fromEntity(viaje);
  }

  obtenerViajes(): ViajeDTO[] {
    const viajes = this.repositorio.obtenerViajes();
    return viajes.map(viaje => ViajeDTO.fromEntity(viaje));
  }

  obtenerViajePorId(id: string): ViajeDTO {
    const idValido = this.validarTexto(id, "Id");
    const viaje = this.repositorio.obtenerViajePorId(idValido);

    if (!viaje) {
      throw new Error(`No se encontró el viaje con id ${idValido}`);
    }

    return ViajeDTO.fromEntity(viaje);
  }

  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): ViajeDTO {
    const idValido = this.validarTexto(id, "Id");
    const reservaIdValido = this.validarTexto(reservaId, "ReservaId");
    const origenValido = this.validarTexto(origen, "Origen");
    const destinoValido = this.validarTexto(destino, "Destino");
    const fechaValida = this.validarFecha(fecha);
    const estadoValido = this.validarTexto(estado, "Estado");
    const conductorValido = this.validarTexto(conductor, "Conductor");

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el viaje con id ${idValido}`);
    }

    const viajeActualizado = this.repositorio.actualizarViaje(
      idValido,
      reservaIdValido,
      origenValido,
      destinoValido,
      fechaValida,
      estadoValido,
      conductorValido,
    );

    if (!viajeActualizado) {
      throw new Error(`No se pudo actualizar el viaje con id ${idValido}`);
    }

    return ViajeDTO.fromEntity(viajeActualizado);
  }

  eliminarViaje(id: string): void {
    const idValido = this.validarTexto(id, "Id");

    if (!this.repositorio.eliminarViaje(idValido)) {
      throw new Error(`No se encontró el viaje con id ${idValido}`);
    }
  }

  private validarTexto(value: string, nombreCampo: string): string {
    if (!value || value.trim().length === 0) {
      throw new Error(`${nombreCampo} inválido.`);
    }
    return value.trim();
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(valor.getTime())) {
      throw new Error("Fecha inválida.");
    }
    return valor;
  }
}
