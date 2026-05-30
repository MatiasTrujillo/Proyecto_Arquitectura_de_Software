import { Request, Response } from "express";
import { ServicioConductor } from "../../Servicio/ServicioConductor";
import { RepositorioConductor } from "../../DataAccess/RepositorioConductor";
import { IServicioConductor } from "../../IServicio/IServicioConductor";

export class ControladorConductor {
  private servicioConductor: IServicioConductor;

  constructor(servicioConductor?: IServicioConductor) {
    this.servicioConductor = servicioConductor ?? new ServicioConductor(new RepositorioConductor());
  }

  crearConductor(req: Request, res: Response): void {
    try {
      const { cedula, nombre } = req.body;
      const conductorCreado = this.servicioConductor.crearConductor(cedula, nombre);
      res.status(201).json({ data: this.mapConductor(conductorCreado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerConductor(req: Request, res: Response): void {
    try {
      const conductores = this.servicioConductor.obtenerConductores();
      res.status(200).json({ data: conductores.map(conductor => this.mapConductor(conductor)) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerConductorPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const conductor = this.servicioConductor.obtenerConductorPorId(id as string);
      res.status(200).json({ data: this.mapConductor(conductor) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarConductor(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const conductorActualizado = this.servicioConductor.actualizarConductor(id as string, cedula, nombre);
      res.status(200).json({ data: this.mapConductor(conductorActualizado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarConductor(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      this.servicioConductor.eliminarConductor(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  //TODO: Crear endpoints para IniciarTraslado y FinalizarTraslado

  private mapConductor(conductor: any) {
    return {
      id: conductor.getId(),
      cedula: conductor.getCedula(),
      nombre: conductor.getNombre(),
      rol: conductor.obtenerRol(),
    };
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