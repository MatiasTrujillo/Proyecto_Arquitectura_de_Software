import { Request, Response } from "express";
import { IServicioViaje } from "../../IServicio/IServicioViaje";
import { ServicioViaje } from "../../Servicio/ServicioViaje";
import { RepositorioViaje } from "../../DataAccess/RepositorioViaje";
import { SolicitudAuth } from "../../../Shared/Auth/SolicitudAuth";

export class ControladorViaje {
  private servicioViaje: IServicioViaje;

  constructor(servicioViaje?: IServicioViaje) {
    this.servicioViaje = servicioViaje ?? new ServicioViaje(new RepositorioViaje());
  }

  crearViaje = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reservaId, origen, destino, fecha, estado, conductor, vehiculo } = req.body;
      const viaje = await this.servicioViaje.crearViaje(reservaId, origen, destino, fecha, estado, conductor, vehiculo ?? '');
      res.status(201).json({ data: viaje });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerMisViajes = async (req: SolicitudAuth, res: Response): Promise<void> => {
    try {
      const conductorId = req.usuario?.cedula;
      if (!conductorId) { res.status(401).json({ error: "No autenticado" }); return; }
      const viajes = await this.servicioViaje.obtenerViajesPorConductor(conductorId);
      res.status(200).json({ data: viajes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerViaje = async (req: Request, res: Response): Promise<void> => {
    try {
      const viajes = await this.servicioViaje.obtenerViajes();
      res.status(200).json({ data: viajes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerViajePorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const viaje = await this.servicioViaje.obtenerViajePorId(req.params.id as string);
      res.status(200).json({ data: viaje });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // traslados en curso con filtros opcionales (vehiculo, conductor, tieneAlertas)
  obtenerViajesEnCurso = async (req: Request, res: Response): Promise<void> => {
    try {
      const { vehiculo, conductor, tieneAlertas } = req.query;
      const filtros = {
        vehiculo: vehiculo as string | undefined,
        conductor: conductor as string | undefined,
        tieneAlertas: tieneAlertas !== undefined ? tieneAlertas === 'true' : undefined,
      };
      const viajes = await this.servicioViaje.obtenerViajesEnCurso(filtros);
      res.status(200).json({ data: viajes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // conductor inicia el traslado
  iniciarTraslado = async (req: SolicitudAuth, res: Response): Promise<void> => {
    try {
      const conductorId = req.usuario?.cedula;
      if (!conductorId) { res.status(401).json({ error: "No se pudo identificar el conductor" }); return; }
      const viaje = await this.servicioViaje.iniciarTraslado(req.params.id as string, conductorId);
      res.status(200).json({ data: viaje });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // conductor finaliza el traslado
  finalizarTraslado = async (req: SolicitudAuth, res: Response): Promise<void> => {
    try {
      const conductorId = req.usuario?.cedula;
      if (!conductorId) { res.status(401).json({ error: "No se pudo identificar el conductor" }); return; }
      const viaje = await this.servicioViaje.finalizarTraslado(req.params.id as string, conductorId);
      res.status(200).json({ data: viaje });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarViaje = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reservaId, origen, destino, fecha, estado, conductor, vehiculo } = req.body;
      const viaje = await this.servicioViaje.actualizarViaje(req.params.id as string, reservaId, origen, destino, fecha, estado, conductor, vehiculo ?? '');
      res.status(200).json({ data: viaje });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarViaje = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.servicioViaje.eliminarViaje(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private manejarError = (res: Response, error: unknown): void => {
    const mensaje = error instanceof Error ? error.message : String(error);
    if (/no se encontr|no encontrado/i.test(mensaje)) { res.status(404).json({ error: mensaje }); return; }
    res.status(400).json({ error: mensaje });
  }
}
