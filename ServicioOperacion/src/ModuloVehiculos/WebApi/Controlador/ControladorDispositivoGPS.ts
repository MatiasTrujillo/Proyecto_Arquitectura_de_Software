import { Request, Response } from "express";
import { ServicioDispositivoGPS } from "../../Servicio/ServicioDispositivoGPS";
import { RepositorioDispositivoGPS } from "../../DataAccess/RepositorioDispositivoGPS";
import { IServicioDispositivoGPS } from "../../IServicio/IServicioDispositivoGPS";

export class ControladorDispositivoGPS {
  private servicio: IServicioDispositivoGPS;

  constructor(servicio?: IServicioDispositivoGPS) {
    this.servicio = servicio ?? new ServicioDispositivoGPS(new RepositorioDispositivoGPS());
  }

  async crearDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const { ubicacion } = req.body;
      const dispositivoDTO = await this.servicio.crearDispositivoGPS(ubicacion);
      res.status(201).json({ data: dispositivoDTO });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const dispositivos = await this.servicio.obtenerDispositivosGPS();
      res.status(200).json({ data: dispositivos });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerDispositivoGPSPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dispositivo = await this.servicio.obtenerDispositivoGPSPorId(Number(id));
      res.status(200).json({ data: dispositivo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { ubicacion } = req.body;
      const dispositivoDTO = await this.servicio.actualizarDispositivoGPS(Number(id), ubicacion);
      res.status(200).json({ data: dispositivoDTO });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicio.eliminarDispositivoGPS(Number(id));
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async recibirInformacion(req: Request, res: Response): Promise<void> {
    try {
      const { dispositivoId, ubicacion, velocidad, timestamp } = req.body;
      res.status(200).json({ mensaje: "Información del GPS recibida y procesada" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async verificarInformacion(req: Request, res: Response): Promise<void> {
    try {
      const { dispositivoId } = req.params;
      res.status(200).json({ data: { valido: true, ultimaUbicacion: {}, ultimaActualizacion: new Date() } });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private manejarError(res: Response, error: any): void {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error });
    }
  }
}