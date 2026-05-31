import { Request, Response } from "express";

export class ControladorViaje {
  crearViaje(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Viaje creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerViaje(req: Request, res: Response): void {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerViajePorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarViaje(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ mensaje: "Viaje actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarViaje(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(204).json({ mensaje: "Viaje eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}