import { IRepositorioViaje, FiltrosViajeEnCurso } from "../IDataAccess/IRepositorioViaje";
import { IServicioViaje } from "../IServicio/IServicioViaje";
import { ViajeDTO } from "../DTOs/ViajeDTO";

export class ServicioViaje implements IServicioViaje {
  constructor(private repositorio: IRepositorioViaje) {}

  async crearViaje(reservaId: string, origen: string, destino: string, fecha: string | Date, estado: string, conductor: string, vehiculo: string): Promise<ViajeDTO> {
    this.validarTexto(reservaId, "reservaId");
    this.validarTexto(origen, "origen");
    this.validarTexto(destino, "destino");
    this.validarTexto(conductor, "conductor");
    const fechaValida = this.validarFecha(fecha);
    const viaje = await this.repositorio.crearViaje(reservaId, origen, destino, fechaValida, estado || "Pendiente", conductor, vehiculo ?? '');
    return ViajeDTO.fromEntity(viaje);
  }

  async obtenerViajes(): Promise<ViajeDTO[]> {
    const viajes = await this.repositorio.obtenerViajes();
    return viajes.map(v => ViajeDTO.fromEntity(v));
  }

  async obtenerViajePorId(id: string): Promise<ViajeDTO> {
    this.validarTexto(id, "id");
    const viaje = await this.repositorio.obtenerViajePorId(id);
    if (!viaje) throw new Error(`No se encontró el viaje con id ${id}`);
    return ViajeDTO.fromEntity(viaje);
  }

  async obtenerViajePorReservaId(reservaId: string): Promise<ViajeDTO | undefined> {
    const viaje = await this.repositorio.obtenerViajePorReservaId(reservaId);
    return viaje ? ViajeDTO.fromEntity(viaje) : undefined;
  }

  async obtenerViajesPorConductor(conductorId: string): Promise<ViajeDTO[]> {
    this.validarTexto(conductorId, "conductorId");
    const viajes = await this.repositorio.obtenerViajesPorConductor(conductorId);
    return viajes.map(v => ViajeDTO.fromEntity(v));
  }

  async obtenerViajesEnCurso(filtros?: FiltrosViajeEnCurso): Promise<ViajeDTO[]> {
    const viajes = await this.repositorio.obtenerViajesEnCurso(filtros);
    return viajes.map(v => ViajeDTO.fromEntity(v));
  }

  async iniciarTraslado(id: string, conductorId: string): Promise<ViajeDTO> {
    this.validarTexto(id, "id");
    this.validarTexto(conductorId, "conductorId");
    const viaje = await this.repositorio.obtenerViajePorId(id);
    if (!viaje) throw new Error(`No se encontró el viaje con id ${id}`);
    if (viaje.getConductor() !== conductorId) throw new Error("El conductor no corresponde a este traslado");
    if (viaje.getEstado() === "En curso") throw new Error("El traslado ya está en curso");
    if (viaje.getEstado() === "Finalizado") throw new Error("El traslado ya fue finalizado");
    const actualizado = await this.repositorio.actualizarEstadoViaje(id, "En curso");
    return ViajeDTO.fromEntity(actualizado!);
  }

  async finalizarTraslado(id: string, conductorId: string): Promise<ViajeDTO> {
    this.validarTexto(id, "id");
    this.validarTexto(conductorId, "conductorId");
    const viaje = await this.repositorio.obtenerViajePorId(id);
    if (!viaje) throw new Error(`No se encontró el viaje con id ${id}`);
    if (viaje.getConductor() !== conductorId) throw new Error("El conductor no corresponde a este traslado");
    if (viaje.getEstado() === "Finalizado") throw new Error("El traslado ya fue finalizado");
    if (viaje.getEstado() !== "En curso") throw new Error("El traslado debe estar en curso para poder finalizarlo");
    const actualizado = await this.repositorio.actualizarEstadoViaje(id, "Finalizado");
    return ViajeDTO.fromEntity(actualizado!);
  }

  async actualizarViaje(id: string, reservaId: string, origen: string, destino: string, fecha: string | Date, estado: string, conductor: string, vehiculo: string): Promise<ViajeDTO> {
    this.validarTexto(id, "id");
    if (!await this.repositorio.existe(id)) throw new Error(`No se encontró el viaje con id ${id}`);
    const fechaValida = this.validarFecha(fecha);
    const actualizado = await this.repositorio.actualizarViaje(id, reservaId, origen, destino, fechaValida, estado, conductor, vehiculo ?? '');
    if (!actualizado) throw new Error(`No se pudo actualizar el viaje con id ${id}`);
    return ViajeDTO.fromEntity(actualizado);
  }

  async eliminarViaje(id: string): Promise<void> {
    this.validarTexto(id, "id");
    if (!await this.repositorio.eliminarViaje(id)) throw new Error(`No se encontró el viaje con id ${id}`);
  }

  private validarTexto(value: string, campo: string): string {
    if (!value || value.trim().length === 0) throw new Error(`${campo} inválido`);
    return value.trim();
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(valor.getTime())) throw new Error("Fecha inválida");
    return valor;
  }
}
