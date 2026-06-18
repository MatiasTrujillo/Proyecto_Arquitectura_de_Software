import { Request, Response } from "express";
import { ServicioReserva } from "../../Servicio/ServicioReserva";
import { RepositorioReserva } from "../../DataAccess/RepositorioReserva";
import { IServicioReserva } from "../../IServicio/IServicioReserva";

export class ControladorReserva {
  private servicioReserva: IServicioReserva;

  constructor(servicioReserva?: IServicioReserva) {
    this.servicioReserva = servicioReserva ?? new ServicioReserva(new RepositorioReserva());
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

  // La operación es atómica (ACID): si falla cualquier paso se hace ROLLBACK completo.
  async asignarVehiculoConductor(req: Request, res: Response): Promise<void> {
    try {
      const { vehiculo, conductor } = req.body;
      if (!vehiculo || !conductor) { res.status(400).json({ error: "vehiculo y conductor son requeridos" }); return; }
      const reserva = await this.servicioReserva.asignarVehiculoConductorConViaje(req.params.id as string, vehiculo, conductor);
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
