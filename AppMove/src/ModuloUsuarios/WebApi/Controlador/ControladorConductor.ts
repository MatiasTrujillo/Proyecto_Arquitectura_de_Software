import { Request, Response } from "express";

export class ControladorConductor {
  crearConductor(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Conductor creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerConductor(req: Request, res: Response): void {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerConductorPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarConductor(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ mensaje: "Conductor actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarConductor(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(204).json({ mensaje: "Conductor eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  //TODO: Crear endpoints para IniciarTraslado y FinalizarTraslado
}