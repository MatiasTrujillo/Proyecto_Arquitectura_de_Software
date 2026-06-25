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
import { PasarelaStripe } from "../../../ModuloPagos/Pasarela/PasarelaStripe";
import { calcularCosto } from "../../../ModuloPagos/Servicio/ServicioCotizacion";
import { RepositorioClientesFrecuentes } from "../../DataAccess/RepositorioClientesFrecuentes";
import { SolicitudAuth } from "../../../Shared/Auth/SolicitudAuth";

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

async function registrarEnAuth0(cedula: string, nombre: string, email: string, password: string, rol: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/api/auth/registrar`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ cedula, nombre, email, password, rol }),
  });
  if (res.ok) return;
  const err = await res.json().catch(() => ({}));
  const mensaje = (err as any).error || '';
  if (/ya existe.*email/i.test(mensaje) || /already exists/i.test(mensaje)) return;
  throw new Error(mensaje || 'Error al registrar credenciales en ServicioAutenticacion');
}

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

  crearClienteEmpresa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cedula, nombre, email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'El email y la contraseña son requeridos' });
        return;
      }
      await registrarEnAuth0(cedula, nombre, email, password, 'ClienteEmpresa');
      const clienteCreado = await this.servicioClienteEmpresa.crearClienteEmpresa(cedula, nombre, email);
      res.status(201).json({ data: clienteCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerClienteEmpresa = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientes = await this.servicioClienteEmpresa.obtenerClienteEmpresas();
      res.status(200).json({ data: clientes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerClienteEmpresaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const cliente = await this.servicioClienteEmpresa.obtenerClienteEmpresaPorId(id as string);
      res.status(200).json({ data: cliente });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarClienteEmpresa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const clienteActualizado = await this.servicioClienteEmpresa.actualizarClienteEmpresa(id as string, cedula, nombre);
      res.status(200).json({ data: clienteActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarClienteEmpresa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.servicioClienteEmpresa.eliminarClienteEmpresa(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  crearPreregistro = async (req: Request, res: Response): Promise<void> => {
    try {
      const clienteEmpresaId = (req as SolicitudAuth).usuario?.cedula;
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

  obtenerPreregistros = async (req: Request, res: Response): Promise<void> => {
    try {
      const clienteEmpresaId = (req as SolicitudAuth).usuario?.cedula;
      const preregistros = await this.servicioPreregistro.obtenerPreregistros(clienteEmpresaId);
      res.status(200).json({ data: preregistros });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerPreregistroPorProducto = async (req: Request, res: Response): Promise<void> => {
    try {
      const clienteEmpresaId = (req as SolicitudAuth).usuario?.cedula;
      const productoId = Number(req.params.productoId);
      const preregistro = await this.servicioPreregistro.obtenerPreregistroPorProducto(clienteEmpresaId, productoId);
      res.status(200).json({ data: preregistro ?? null });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarPreregistro = async (req: Request, res: Response): Promise<void> => {
    try {
      const clienteEmpresaId = (req as SolicitudAuth).usuario?.cedula;
      await this.servicioPreregistro.eliminarPreregistro(Number(req.params.id), clienteEmpresaId);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  realizarReserva = async (req: Request, res: Response): Promise<void> => {
    try {
      const clienteId = (req as SolicitudAuth).usuario?.cedula ?? req.body.clienteId;
      const { origen, destino, fecha, vehiculo, bienes, conductor } = req.body;

      const productosIds = (bienes ?? []).map((b: any) => b.productoId).filter(Boolean).map(Number);
      const todasLasCategorias: string[] = (bienes ?? []).flatMap((b: any) => b.categorias ?? []);
      const costo = await calcularCosto(todasLasCategorias);

      const reserva = await this.servicioReserva.crearReserva(
        clienteId, origen, destino, fecha, costo, productosIds, [], vehiculo, conductor
      );

      const repoProductos = new RepositorioProductoReserva();
      try {
        await repoProductos.guardarProductos(Number(reserva.id), (bienes ?? []).map((b: any) => ({
          productoId: b.productoId ? Number(b.productoId) : null,
          descripcion: b.descripcion ?? '',
          valor: b.valor != null ? Number(b.valor) : null,
          tamano: b.tamano != null ? Number(b.tamano) : null,
          categorias: b.categorias ?? [],
        })));
      } catch {
        // falla silenciosa — la reserva ya fue creada
      }

      busEventos.emit(EVENTO_RESERVA_CREADA, {
        reservaId: reserva.id,
        clienteId,
        productosIds,
        bienes: bienes ?? [],
        esEmpresa: true,
      });

      new RepositorioClientesFrecuentes().actualizarTop20().catch(() => {});

      res.status(201).json({ data: reserva });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerReservas = async (req: Request, res: Response): Promise<void> => {
    try {
      const clienteId = (req as SolicitudAuth).usuario?.cedula ?? req.params.clienteId;
      const { fechaDesde, fechaHasta, estado, limit, page } = req.query as Record<string, string>;
      const limitNum  = limit ? Math.min(Number(limit), 100) : undefined;
      const offsetNum = page && limitNum ? (Number(page) - 1) * limitNum : undefined;
      const reservas = await this.servicioReserva.obtenerReservasPorCliente(clienteId as string, fechaDesde, fechaHasta, estado, limitNum, offsetNum);
      res.status(200).json({ data: reservas });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  consultarEstadoReserva = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservaId = req.params.reservaId as string;
      const estado = await this.servicioReserva.consultarEstadoReserva(reservaId);
      res.status(200).json({ data: { estado } });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  realizarPago = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reservaId, metodoPago } = req.body;
      if (!reservaId)  throw new Error("reservaId es requerido");
      if (!metodoPago) throw new Error("metodoPago es requerido (ej: pm_card_visa)");

      const reserva = await this.servicioReserva.obtenerReservaPorId(reservaId);
      if (reserva.estado === "Pagado") throw new Error("Esta reserva ya fue pagada");
      if (!reserva.categorias || reserva.categorias.length === 0) throw new Error("La reserva no puede pagarse hasta que el operador determine su categoría");

      const pasarela = new PasarelaStripe();
      let resultado;
      try {
        resultado = await pasarela.procesarPago(reserva.costo, reservaId, metodoPago);
      } catch (e: any) {
        res.status(503).json({ error: e.message ?? 'Pasarela de pago fuera de servicio' });
        return;
      }

      const pago = await this.servicioPago.crearPago(
        new Date(), reserva.costo, resultado.estado, reservaId, 'stripe'
      );

      if (resultado.estado === 'aceptado') {
        await this.servicioReserva.actualizarEstadoReserva(reservaId, 'Pagado');
      }

      res.status(201).json({ data: { pago, transaccionId: resultado.transaccionId, estadoPago: resultado.estado } });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  registrarOrigenFrecuente = async (req: Request, res: Response): Promise<void> => {
    try {
      const cedula = (req as SolicitudAuth).usuario?.cedula;
      const { origen } = req.body;
      if (!origen) { res.status(400).json({ error: 'Origen requerido' }); return; }
      const repo = new RepositorioClienteEmpresa();
      await repo.agregarOrigenFrecuente(cedula, origen);
      res.status(201).json({ mensaje: 'Origen frecuente registrado' });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  registrarDestinoFrecuente = async (req: Request, res: Response): Promise<void> => {
    try {
      const cedula = (req as SolicitudAuth).usuario?.cedula;
      const { destino } = req.body;
      if (!destino) { res.status(400).json({ error: 'Destino requerido' }); return; }
      const repo = new RepositorioClienteEmpresa();
      await repo.agregarDestinoFrecuente(cedula, destino);
      res.status(201).json({ mensaje: 'Destino frecuente registrado' });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerFrecuentes = async (req: Request, res: Response): Promise<void> => {
    try {
      const cedula = (req as SolicitudAuth).usuario?.cedula;
      const repo = new RepositorioClienteEmpresa();
      const datos = await repo.obtenerFrecuentes(cedula);
      res.status(200).json({ data: datos });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private manejarError = (res: Response, error: unknown): void => {
    const mensaje = error instanceof Error ? error.message : String(error);
    if (/no se encontr|no encontrado/i.test(mensaje)) {
      res.status(404).json({ error: mensaje });
      return;
    }
    res.status(400).json({ error: mensaje });
  }
}
