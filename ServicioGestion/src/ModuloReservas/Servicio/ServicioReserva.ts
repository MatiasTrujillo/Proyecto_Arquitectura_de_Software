import { ReservaDTO } from "../DTOs/ReservaDTO";
import { IRepositorioReserva } from "../IDataAccess/IRepositorioReserva";
import { IServicioReserva } from "../IServicio/IServicioReserva";

export class ServicioReserva implements IServicioReserva {
  constructor(private repositorio: IRepositorioReserva) {}

  async crearReserva(
    clienteId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    costo: number,
    vehiculo: string,
    productos: string[],
    conductor: string,
    categorias: string[]
  ): Promise<ReservaDTO> {
    this.validarCampo(clienteId, "clienteId");
    this.validarCampo(origen, "origen");
    this.validarCampo(destino, "destino");
    this.validarCampo(vehiculo, "vehiculo");
    this.validarCampo(conductor, "conductor");
    const fechaValida = this.validarFecha(fecha);
    this.validarCosto(costo);

    const reserva = await this.repositorio.crearReserva(
      clienteId, origen, destino, fechaValida, "Pendiente", costo,
      vehiculo, productos ?? [], conductor, categorias ?? []
    );
    return ReservaDTO.fromEntity(reserva);
  }

  async obtenerReservas(): Promise<ReservaDTO[]> {
    const reservas = await this.repositorio.obtenerReservas();
    return reservas.map(r => ReservaDTO.fromEntity(r));
  }

  async obtenerReservaPorId(reservaId: string): Promise<ReservaDTO> {
    this.validarCampo(reservaId, "reservaId");
    const reserva = await this.repositorio.obtenerReservaPorId(reservaId);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return ReservaDTO.fromEntity(reserva);
  }

  async actualizarEstadoReserva(reservaId: string, estado: string): Promise<ReservaDTO> {
    this.validarCampo(reservaId, "reservaId");
    this.validarCampo(estado, "estado");
    const reserva = await this.repositorio.actualizarEstadoReserva(reservaId, estado);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return ReservaDTO.fromEntity(reserva);
  }

  async obtenerReservasPorCliente(clienteId: string): Promise<ReservaDTO[]> {
    this.validarCampo(clienteId, "clienteId");
    const reservas = await this.repositorio.obtenerReservasPorCliente(clienteId);
    return reservas.map(r => ReservaDTO.fromEntity(r));
  }

  async consultarEstadoReserva(reservaId: string): Promise<string> {
    this.validarCampo(reservaId, "reservaId");
    const reserva = await this.repositorio.obtenerReservaPorId(reservaId);
    if (!reserva) {
      throw new Error(`No se encontró la reserva con id ${reservaId}`);
    }
    return reserva.getEstado();
  }

  private validarCampo(valor: string, campo: string): void {
    if (!valor || typeof valor !== "string" || valor.trim() === "") {
      throw new Error(`${campo} inválido`);
    }
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha as string);
    if (Number.isNaN(valor.getTime())) {
      throw new Error("Fecha inválida");
    }
    return valor;
  }

  private validarCosto(costo: number): void {
    if (typeof costo !== "number" || Number.isNaN(costo) || costo < 0) {
      throw new Error("Costo inválido. Debe ser un número mayor o igual a cero");
    }
  }
}
