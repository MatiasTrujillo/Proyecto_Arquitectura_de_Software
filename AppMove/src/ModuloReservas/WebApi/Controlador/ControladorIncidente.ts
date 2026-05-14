import { Request, Response } from "express";

export class ControladorIncidente {
  crearIncidente(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Incidente creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerIncidente(req: Request, res: Response): void {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerIncidentePorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarIncidente(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ mensaje: "Incidente actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarIncidente(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(204).json({ mensaje: "Incidente eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}