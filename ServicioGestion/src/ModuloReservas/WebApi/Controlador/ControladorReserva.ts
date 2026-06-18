import { Request, Response } from "express";
import { ServicioReserva } from "../../Servicio/ServicioReserva";
import { RepositorioReserva } from "../../DataAccess/RepositorioReserva";
import { IServicioReserva } from "../../IServicio/IServicioReserva";
import { ServicioViaje } from "../../Servicio/ServicioViaje";
import { RepositorioViaje } from "../../DataAccess/RepositorioViaje";
import { IServicioViaje } from "../../IServicio/IServicioViaje";

export class ControladorReserva {
  private servicioReserva: IServicioReserva;
  private servicioViaje: IServicioViaje;

  constructor(servicioReserva?: IServicioReserva, servicioViaje?: IServicioViaje) {
    this.servicioReserva = servicioReserva ?? new ServicioReserva(new RepositorioReserva());
    this.servicioViaje   = servicioViaje   ?? new ServicioViaje(new RepositorioViaje());
  }

  async crearReserva(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId, origen, destino, fecha, costo, productos, categorias } = req.body;
      const reserva = await this.servicioReserva.crearReserva(clienteId, origen, destino, fecha, Number(costo ?? 0), productos ?? [], categorias ?? []);
      res.status(201).json({ data: reserva });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerReservas(req: Request, res: Response): Promise<void> {
    try {
      const reservas = await this.servicioReserva.obtenerReservas();
      res.status(200).json({ data: reservas });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerReservasSinViaje(req: Request, res: Response): Promise<void> {
    try {
      const reservas = await this.servicioReserva.obtenerReservasSinViaje();
      res.status(200).json({ data: reservas });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerReservaPorId(req: Request, res: Response): Promise<void> {
    try {
      const reserva = await this.servicioReserva.obtenerReservaPorId(req.params.id as string);
      res.status(200).json({ data: reserva });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarEstadoReserva(req: Request, res: Response): Promise<void> {
    try {
      const { estado } = req.body;
      const reserva = await this.servicioReserva.actualizarEstadoReserva(req.params.id as string, estado);
      res.status(200).json({ data: reserva });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // F12: Operador asigna vehículo y conductor a una reserva → crea el viaje automáticamente
  async asignarVehiculoConductor(req: Request, res: Response): Promise<void> {
    try {
      const { vehiculo, conductor } = req.body;
      if (!vehiculo || !conductor) { res.status(400).json({ error: "vehiculo y conductor son requeridos" }); return; }
      const reserva = await this.servicioReserva.asignarVehiculoConductor(req.params.id as string, vehiculo, conductor);

      // Crear viaje solo si no existe uno para esta reserva
      const existente = await this.servicioViaje.obtenerViajePorReservaId(String(reserva.id));
      if (!existente) {
        await this.servicioViaje.crearViaje(
          String(reserva.id), reserva.origen, reserva.destino,
          reserva.fecha, 'Pendiente', conductor, vehiculo
        );
      }

      res.status(200).json({ data: reserva });
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
