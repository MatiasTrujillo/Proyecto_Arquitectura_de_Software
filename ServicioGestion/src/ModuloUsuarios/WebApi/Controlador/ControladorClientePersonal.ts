import { Request, Response } from "express";
import { ServicioClientePersonal } from "../../Servicio/ServicioClientePersonal";
import { RepositorioClientePersonal } from "../../DataAccess/RepositorioClientePersonal";
import { IServicioClientePersonal } from "../../IServicio/IServicioClientePersonal";
import { IServicioReserva } from "../../../ModuloReservas/IServicio/IServicioReserva";
import { ServicioReserva } from "../../../ModuloReservas/Servicio/ServicioReserva";
import { RepositorioReserva } from "../../../ModuloReservas/DataAccess/RepositorioReserva";
import { IServicioPago } from "../../../ModuloPagos/IServicio/IServicioPago";
import { ServicioPago } from "../../../ModuloPagos/Servicio/ServicioPago";
import { RepositorioPago } from "../../../ModuloPagos/DataAccess/RepositorioPago";

export class ControladorClientePersonal {
  private servicioClientePersonal: IServicioClientePersonal;
  private servicioReserva: IServicioReserva;
  private servicioPago: IServicioPago;

  constructor(
    servicioClientePersonal?: IServicioClientePersonal,
    servicioReserva?: IServicioReserva,
    servicioPago?: IServicioPago
  ) {
    this.servicioClientePersonal = servicioClientePersonal ?? new ServicioClientePersonal(new RepositorioClientePersonal());
    this.servicioReserva = servicioReserva ?? new ServicioReserva(new RepositorioReserva());
    this.servicioPago = servicioPago ?? new ServicioPago(new RepositorioPago());
  }

  async crearClientePersonal(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, nombre } = req.body;
      const clienteCreado = await this.servicioClientePersonal.crearClientePersonal(cedula, nombre);
      res.status(201).json({ data: clienteCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerClientePersonal(req: Request, res: Response): Promise<void> {
    try {
      const clientes = await this.servicioClientePersonal.obtenerClientePersonales();
      res.status(200).json({ data: clientes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerClientePersonalPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await this.servicioClientePersonal.obtenerClientePersonalPorId(id as string);
      res.status(200).json({ data: cliente });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarClientePersonal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const clienteActualizado = await this.servicioClientePersonal.actualizarClientePersonal(id as string, cedula, nombre);
      res.status(200).json({ data: clienteActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarClientePersonal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicioClientePersonal.eliminarClientePersonal(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  calcularTraslado(req: Request, res: Response): void {
    try {
      const { origen, destino } = req.body;
      res.status(200).json({ data: { costo: 0, tiempo: 0 } });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async realizarReserva(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = (req as any).usuario?.cedula ?? req.body.clienteId;
      const { origen, destino, fecha, costo, vehiculo, productos, conductor, categorias } = req.body;
      const reserva = await this.servicioReserva.crearReserva(
        clienteId, origen, destino, fecha, costo, productos ?? [], categorias ?? [], vehiculo, conductor
      );
      res.status(201).json({ data: reserva });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerReservas(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = (req as any).usuario?.cedula ?? req.params.clienteId;
      const reservas = await this.servicioReserva.obtenerReservasPorCliente(clienteId as string);
      res.status(200).json({ data: reservas });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async consultarEstadoReserva(req: Request, res: Response): Promise<void> {
    try {
      const reservaId = req.params.reservaId as string;
      const estado = await this.servicioReserva.consultarEstadoReserva(reservaId);
      res.status(200).json({ data: { estado } });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async realizarPago(req: Request, res: Response): Promise<void> {
    try {
      const { reservaId } = req.body;
      if (!reservaId) throw new Error("reservaId es requerido");
      const reserva = await this.servicioReserva.obtenerReservaPorId(reservaId);
      if (reserva.estado === "Pagado") throw new Error("Esta reserva ya fue pagada");
      const pago = await this.servicioPago.crearPago(new Date(), reserva.costo, "Completado", reservaId);
      await this.servicioReserva.actualizarEstadoReserva(reservaId, "Pagado");
      res.status(201).json({ data: pago });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private manejarError(res: Response, error: unknown): void {
    const mensaje = error instanceof Error ? error.message : String(error);

    if (/no se encontr|no encontrado/i.test(mensaje)) {
      res.status(404).json({ error: mensaje });
      return;
    }

    res.status(400).json({ error: mensaje });
  }
}
