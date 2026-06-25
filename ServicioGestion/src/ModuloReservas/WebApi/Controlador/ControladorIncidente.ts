import { Request, Response } from "express";
import { ServicioIncidente } from "../../Servicio/ServicioIncidente";
import { RepositorioIncidente } from "../../DataAccess/RepositorioIncidente";
import { IServicioIncidente } from "../../IServicio/IServicioIncidente";
import { SolicitudAuth } from "../../../Shared/Auth/SolicitudAuth";

export class ControladorIncidente {
  private servicioIncidente: IServicioIncidente;

  constructor(servicioIncidente?: IServicioIncidente) {
    this.servicioIncidente = servicioIncidente ?? new ServicioIncidente(new RepositorioIncidente());
  }

  crearIncidente = async (req: Request, res: Response): Promise<void> => {
    try {
      const { descripcion, fecha, reservaId, estado, severidad } = req.body;
      // Si no viene conductorId en el body, se toma del token (caso conductor reportando)
      const conductorId = req.body.conductorId || (req as SolicitudAuth).usuario?.cedula || '';
      const incidenteCreado = await this.servicioIncidente.crearIncidente(descripcion, fecha, reservaId, estado, severidad, conductorId);
      res.status(201).json({ data: incidenteCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerIncidente = async (req: Request, res: Response): Promise<void> => {
    try {
      const incidentes = await this.servicioIncidente.obtenerIncidentes();
      res.status(200).json({ data: incidentes });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerIncidentePorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const incidente = await this.servicioIncidente.obtenerIncidentePorId(req.params.id as string);
      res.status(200).json({ data: incidente });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarIncidente = async (req: Request, res: Response): Promise<void> => {
    try {
      const { descripcion, fecha, reservaId, estado, severidad, conductorId } = req.body;
      const incidenteActualizado = await this.servicioIncidente.actualizarIncidente(req.params.id as string, descripcion, fecha, reservaId, estado, severidad, conductorId ?? '');
      res.status(200).json({ data: incidenteActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarIncidente = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.servicioIncidente.eliminarIncidente(req.params.id as string);
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
