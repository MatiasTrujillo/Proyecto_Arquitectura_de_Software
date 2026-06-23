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
import { ServicioPreregistroProducto } from "../../Servicio/ServicioPreregistroProducto";
import { RepositorioPreregistroProducto } from "../../DataAccess/RepositorioPreregistroProducto";
import { busEventos, EVENTO_RESERVA_CREADA } from "../../../Shared/Eventos/BusEventos";
import { RepositorioProductoReserva } from "../../../ModuloReservas/DataAccess/RepositorioProductoReserva";

export class ControladorClienteEmpresa {
  private servicioClienteEmpresa: IServicioClienteEmpresa;
  private servicioReserva: IServicioReserva;
  private servicioPago: IServicioPago;
  private servicioPreregistro: ServicioPreregistroProducto;

  constructor(
    servicioClienteEmpresa?: IServicioClienteEmpresa,
    servicioReserva?: IServicioReserva,
    servicioPago?: IServicioPago
  ) {
    this.servicioClienteEmpresa = servicioClienteEmpresa ?? new ServicioClienteEmpresa(new RepositorioClienteEmpresa());
    this.servicioReserva = servicioReserva ?? new ServicioReserva(new RepositorioReserva());
    this.servicioPago = servicioPago ?? new ServicioPago(new RepositorioPago());
    this.servicioPreregistro = new ServicioPreregistroProducto(new RepositorioPreregistroProducto());
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
      res.status(200).json({ data: { costo: 0, tiempo: 0 } });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  // ── Pre-registro de bienes (F3) ─────────────────────────────────────────────

  async crearPreregistro(req: Request, res: Response): Promise<void> {
    try {
      const clienteEmpresaId = (req as any).usuario?.cedula;
      const { productoId, productoNombre, descripcion, valor, tamano } = req.body;
      if (!productoId) { res.status(400).json({ error: 'productoId es requerido' }); return; }
      const preregistro = await this.servicioPreregistro.crearPreregistro(
        clienteEmpresaId,
        Number(productoId),
        productoNombre ?? '',
        descripcion,
        valor != null ? Number(valor) : null,
        tamano != null ? Number(tamano) : null,
      );
      res.status(201).json({ data: preregistro });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerPreregistros(req: Request, res: Response): Promise<void> {
    try {
      const clienteEmpresaId = (req as any).usuario?.cedula;
      const preregistros = await this.servicioPreregistro.obtenerPreregistros(clienteEmpresaId);
      res.status(200).json({ data: preregistros });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerPreregistroPorProducto(req: Request, res: Response): Promise<void> {
    try {
      const clienteEmpresaId = (req as any).usuario?.cedula;
      const productoId = Number(req.params.productoId);
      const preregistro = await this.servicioPreregistro.obtenerPreregistroPorProducto(clienteEmpresaId, productoId);
      res.status(200).json({ data: preregistro ?? null });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarPreregistro(req: Request, res: Response): Promise<void> {
    try {
      const clienteEmpresaId = (req as any).usuario?.cedula;
      await this.servicioPreregistro.eliminarPreregistro(Number(req.params.id), clienteEmpresaId);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // ── Reservas ────────────────────────────────────────────────────────────────

  async realizarReserva(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = (req as any).usuario?.cedula ?? req.body.clienteId;
      const { origen, destino, fecha, costo, vehiculo, bienes, conductor } = req.body;

      const productosIds = (bienes ?? []).map((b: any) => b.productoId).filter(Boolean).map(Number);

      const reserva = await this.servicioReserva.crearReserva(
        clienteId, origen, destino, fecha, costo, productosIds, [], vehiculo, conductor
      );

      const repoProductos = new RepositorioProductoReserva();
      await repoProductos.guardarProductos(Number(reserva.id), (bienes ?? []).map((b: any) => ({
        productoId: b.productoId ? Number(b.productoId) : null,
        descripcion: b.descripcion ?? '',
        valor: b.valor != null ? Number(b.valor) : null,
        tamano: b.tamano != null ? Number(b.tamano) : null,
        categorias: b.categorias ?? [],
      })));

      busEventos.emit(EVENTO_RESERVA_CREADA, {
        reservaId: reserva.id,
        clienteId,
        productosIds,
        bienes: bienes ?? [],
        esEmpresa: true,
      });

      res.status(201).json({ data: reserva });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerReservas(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = (req as any).usuario?.cedula ?? req.params.clienteId;
      const { fechaDesde, fechaHasta, estado } = req.query as Record<string, string>;
      const reservas = await this.servicioReserva.obtenerReservasPorCliente(clienteId as string, fechaDesde, fechaHasta, estado);
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
