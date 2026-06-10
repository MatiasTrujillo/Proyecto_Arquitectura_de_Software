import { Request, Response } from "express";
import { ServicioConductor } from "../../Servicio/ServicioConductor";
import { RepositorioConductor } from "../../DataAccess/RepositorioConductor";
import { IServicioConductor } from "../../IServicio/IServicioConductor";

export class ControladorConductor {
  private servicioConductor: IServicioConductor;

  constructor(servicioConductor?: IServicioConductor) {
    this.servicioConductor = servicioConductor ?? new ServicioConductor(new RepositorioConductor());
  }

  async crearConductor(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, nombre } = req.body;
      const conductorCreado = await this.servicioConductor.crearConductor(cedula, nombre);
      res.status(201).json({ data: conductorCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerConductor(req: Request, res: Response): Promise<void> {
    try {
      const conductores = await this.servicioConductor.obtenerConductores();
      res.status(200).json({ data: conductores });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerConductorPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conductor = await this.servicioConductor.obtenerConductorPorId(id as string);
      res.status(200).json({ data: conductor });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarConductor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const conductorActualizado = await this.servicioConductor.actualizarConductor(id as string, cedula, nombre);
      res.status(200).json({ data: conductorActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarConductor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicioConductor.eliminarConductor(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  //TODO: Crear endpoints para IniciarTraslado y FinalizarTraslado

  private manejarError(res: Response, error: unknown): void {
    const mensaje = error instanceof Error ? error.message : String(error);

    if (/no se encontr|no encontrado/i.test(mensaje)) {
      res.status(404).json({ error: mensaje });
      return;
    }

    res.status(400).json({ error: mensaje });
  }
}