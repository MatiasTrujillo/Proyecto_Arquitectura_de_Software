import { Request, Response } from "express";
import { ServicioClienteEmpresa } from "../../Servicio/ServicioClienteEmpresa";
import { RepositorioClienteEmpresa } from "../../DataAccess/RepositorioClienteEmpresa";
import { IServicioClienteEmpresa } from "../../IServicio/IServicioClienteEmpresa";
import { IServicioReserva } from "../../../ModuloReservas/IServicio/IServicioReserva";
import { ServicioReserva } from "../../../ModuloReservas/Servicio/ServicioReserva";
import { RepositorioReserva } from "../../../ModuloReservas/DataAccess/RepositorioReserva";
import { IServicioPago } from "../../../ModuloPagos/IServicio/IServicioPago";
import { ServicioPago } from "../../../ModuloPagos/Servicio/ServicioPago";
import { RepositorioPago } from "../../../ModuloPagos/DataAccess/RepositorioPago";

export class ControladorClienteEmpresa {
  private servicioClienteEmpresa: IServicioClienteEmpresa;
  private servicioReserva: IServicioReserva;
  private servicioPago: IServicioPago;

  constructor(
    servicioClienteEmpresa?: IServicioClienteEmpresa,
    servicioReserva?: IServicioReserva,
    servicioPago?: IServicioPago
  ) {
    this.servicioClienteEmpresa = servicioClienteEmpresa ?? new ServicioClienteEmpresa(new RepositorioClienteEmpresa());
    this.servicioReserva = servicioReserva ?? new ServicioReserva(new RepositorioReserva());
    this.servicioPago = servicioPago ?? new ServicioPago(new RepositorioPago());
  }

  async crearClienteEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, nombre } = req.body;
      const clienteCreado = await this.servicioClienteEmpresa.crearClienteEmpresa(cedula, nombre);
      res.status(201).json({ data: clienteCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerClienteEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const clientes = await this.servicioClienteEmpresa.obtenerClienteEmpresas();
      res.status(200).json({ data: clientes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerClienteEmpresaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await this.servicioClienteEmpresa.obtenerClienteEmpresaPorId(id as string);
      res.status(200).json({ data: cliente });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarClienteEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const clienteActualizado = await this.servicioClienteEmpresa.actualizarClienteEmpresa(id as string, cedula, nombre);
      res.status(200).json({ data: clienteActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarClienteEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicioClienteEmpresa.eliminarClienteEmpresa(id as string);
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
      res.status(500).json({ error: error });
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

  asociarProducto(req: Request, res: Response): void {
    try {
      const { clienteId, productoId } = req.body;
      res.status(200).json({ mensaje: "Producto asociado al clienteEmpresa" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async registrarOrigenFrecuente(req: Request, res: Response): Promise<void> {
    try {
      const cedula = (req as any).usuario?.cedula;
      const { origen } = req.body;
      if (!origen) { res.status(400).json({ error: 'Origen requerido' }); return; }
      const repo = new (await import('../../DataAccess/RepositorioClienteEmpresa')).RepositorioClienteEmpresa();
      await repo.agregarOrigenFrecuente(cedula, origen);
      res.status(201).json({ mensaje: 'Origen frecuente registrado' });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async registrarDestinoFrecuente(req: Request, res: Response): Promise<void> {
    try {
      const cedula = (req as any).usuario?.cedula;
      const { destino } = req.body;
      if (!destino) { res.status(400).json({ error: 'Destino requerido' }); return; }
      const repo = new (await import('../../DataAccess/RepositorioClienteEmpresa')).RepositorioClienteEmpresa();
      await repo.agregarDestinoFrecuente(cedula, destino);
      res.status(201).json({ mensaje: 'Destino frecuente registrado' });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerFrecuentes(req: Request, res: Response): Promise<void> {
    try {
      const cedula = (req as any).usuario?.cedula;
      const repo = new (await import('../../DataAccess/RepositorioClienteEmpresa')).RepositorioClienteEmpresa();
      const datos = await repo.obtenerFrecuentes(cedula);
      res.status(200).json({ data: datos });
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
