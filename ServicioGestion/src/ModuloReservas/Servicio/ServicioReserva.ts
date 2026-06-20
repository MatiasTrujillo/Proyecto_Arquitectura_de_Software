import { ReservaDTO } from "../DTOs/ReservaDTO";
import { IRepositorioReserva } from "../IDataAccess/IRepositorioReserva";
import { IServicioReserva } from "../IServicio/IServicioReserva";
import { colaReservas, Prioridad } from "../WebApi/Cola/ColaPrioridad";
import { RepositorioClientesFrecuentes } from "../../ModuloUsuarios/DataAccess/RepositorioClientesFrecuentes";

const repoFrecuentes = new RepositorioClientesFrecuentes();
const OPERACION_URL = process.env.OPERACION_URL || 'http://localhost:3000';

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
    if (!productos || productos.length === 0) throw new Error("La reserva debe tener al menos un producto");

    // Priority Queue (R1): determinar prioridad antes de encolar
    const prioridad: Prioridad = await repoFrecuentes.determinarPrioridad(clienteId);

    const reserva = await colaReservas.encolar(prioridad, () =>
      this.repositorio.crearReserva(
        clienteId, origen, destino, fechaValida, "Pendiente", costo,
        vehiculo ?? null, productos, conductor ?? null, categorias ?? []
      )
    );

    return ReservaDTO.fromEntity(reserva, prioridad);
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
    await this.validarCapacidadVehiculo(reservaId, vehiculo);
    const reserva = await this.repositorio.asignarVehiculoConductor(reservaId, vehiculo, conductor);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return ReservaDTO.fromEntity(reserva);
  }

  async asignarVehiculoConductorConViaje(reservaId: string, vehiculo: string, conductor: string): Promise<ReservaDTO> {
    this.validarCampo(reservaId, 'reservaId');
    this.validarCampo(vehiculo,  'vehiculo');
    this.validarCampo(conductor, 'conductor');
    await this.validarCapacidadVehiculo(reservaId, vehiculo);
    const reserva = await this.repositorio.asignarYCrearViajeAtomico(reservaId, vehiculo, conductor);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return ReservaDTO.fromEntity(reserva);
  }

  private async validarCapacidadVehiculo(reservaId: string, vehiculoMatricula: string): Promise<void> {
    const tamanoTotal = await this.repositorio.obtenerTamanoTotalProductos(reservaId);
    if (tamanoTotal === 0) return; // si ningún producto tiene tamaño definido, se permite

    try {
      const resp = await fetch(`${OPERACION_URL}/api/vehiculos/matricula/${encodeURIComponent(vehiculoMatricula)}`);
      if (!resp.ok) return; // ServicioOperacion no disponible: se permite en modo degradado
      const json = await resp.json();
      const capacidad: number = json.data?.capacidad ?? Infinity;
      if (tamanoTotal > capacidad) {
        throw new Error(
          `El vehículo ${vehiculoMatricula} no tiene capacidad suficiente. ` +
          `Tamaño total de productos: ${tamanoTotal}, capacidad del vehículo: ${capacidad}.`
        );
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('capacidad suficiente')) throw e;
      // ServicioOperacion no disponible: se permite en modo degradado
    }
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
