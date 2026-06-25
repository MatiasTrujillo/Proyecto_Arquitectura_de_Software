import { Request, Response } from "express";
import { ServicioZonaGeografica } from "../../Servicio/ServicioZonaGeografica";
import { RepositorioZonaGeografica } from "../../DataAccess/RepositorioZonaGeografica";
import { IServicioZonaGeografica } from "../../IServicio/IServicioZonaGeografica";

export class ControladorZonaGeografica {
  private servicioZona: IServicioZonaGeografica;

  constructor(servicioZona?: IServicioZonaGeografica) {
    this.servicioZona = servicioZona ?? new ServicioZonaGeografica(new RepositorioZonaGeografica());
  }

  crearZona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombre, delimitacionGeografica, tipo } = req.body;
      const zona = await this.servicioZona.crearZona(nombre, delimitacionGeografica, tipo ?? 'roja');
      res.status(201).json({ data: zona });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerZonas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const zonas = await this.servicioZona.obtenerZonas();
      res.status(200).json({ data: zonas });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerZonaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const zona = await this.servicioZona.obtenerZonaPorId(req.params.id as string);
      res.status(200).json({ data: zona });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarZona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombre, delimitacionGeografica, tipo } = req.body;
      const zona = await this.servicioZona.actualizarZona(req.params.id as string, nombre, delimitacionGeografica, tipo ?? 'roja');
      res.status(200).json({ data: zona });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarZona = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.servicioZona.eliminarZona(req.params.id as string);
      res.status(204).send();
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
