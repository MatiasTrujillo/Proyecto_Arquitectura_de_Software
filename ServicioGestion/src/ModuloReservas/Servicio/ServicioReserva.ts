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
    productos: string[],
    categorias: string[],
    vehiculo?: string,
    conductor?: string,
  ): Promise<ReservaDTO> {
    this.validarCampo(clienteId, "clienteId");
    this.validarCampo(origen, "origen");
    this.validarCampo(destino, "destino");
    const fechaValida = this.validarFechaFutura(fecha);
    this.validarCosto(costo);
    // TODO F4.1/F4.2: validar al menos un bien cuando se implemente el formulario de bienes

    const reserva = await this.repositorio.crearReserva(
      clienteId, origen, destino, fechaValida, "Pendiente", costo,
      vehiculo ?? null, productos, conductor ?? null, categorias ?? []
    );
    return ReservaDTO.fromEntity(reserva);
  }

  async obtenerReservas(): Promise<ReservaDTO[]> {
    return (await this.repositorio.obtenerReservas()).map(r => ReservaDTO.fromEntity(r));
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
    return (await this.repositorio.obtenerReservasPorCliente(clienteId)).map(r => ReservaDTO.fromEntity(r));
  }

  async asignarVehiculoConductor(reservaId: string, vehiculo: string, conductor: string): Promise<ReservaDTO> {
    this.validarCampo(reservaId, "reservaId");
    this.validarCampo(vehiculo, "vehiculo");
    this.validarCampo(conductor, "conductor");
    const reserva = await this.repositorio.asignarVehiculoConductor(reservaId, vehiculo, conductor);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return ReservaDTO.fromEntity(reserva);
  }

  async obtenerReservasSinViaje(): Promise<ReservaDTO[]> {
    return (await this.repositorio.obtenerReservasSinViaje()).map(r => ReservaDTO.fromEntity(r));
  }

  async consultarEstadoReserva(reservaId: string): Promise<string> {
    this.validarCampo(reservaId, "reservaId");
    const reserva = await this.repositorio.obtenerReservaPorId(reservaId);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return reserva.getEstado();
  }

  private validarCampo(valor: string, campo: string): void {
    if (!valor || typeof valor !== "string" || valor.trim() === "") throw new Error(`${campo} inválido`);
  }

  private validarFechaFutura(fecha: string | Date): Date {
    let valor: Date;
    if (fecha instanceof Date) {
      valor = fecha;
    } else {
      // Parsear "YYYY-MM-DD" como fecha local (sin Z) para evitar conversión UTC→local
      const partes = (fecha as string).split('T')[0].split('-').map(Number);
      valor = new Date(partes[0], partes[1] - 1, partes[2]);
    }
    if (Number.isNaN(valor.getTime())) throw new Error("Fecha inválida");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const soloFecha = new Date(valor);
    soloFecha.setHours(0, 0, 0, 0);
    if (soloFecha <= hoy) throw new Error("La fecha de la reserva debe ser futura");
    return valor;
  }

  private validarCosto(costo: number): void {
    if (typeof costo !== "number" || Number.isNaN(costo) || costo < 0) throw new Error("Costo inválido. Debe ser un número mayor o igual a cero");
  }
}
