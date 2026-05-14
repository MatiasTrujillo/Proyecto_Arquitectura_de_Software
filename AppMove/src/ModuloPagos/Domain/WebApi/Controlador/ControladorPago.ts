import { Request, Response } from "express";

export class ControladorPago {
  crearPago(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Pago creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerPago(req: Request, res: Response): void {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerPagoPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarPago(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ mensaje: "Pago actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarPago(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(204).json({ mensaje: "Pago eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}