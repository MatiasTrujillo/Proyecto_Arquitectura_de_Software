import { Request, Response } from "express";

export class ControladorProducto {
  crearProducto(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Producto creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerProducto(req: Request, res: Response): void {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerProductoPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarProducto(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ mensaje: "Producto actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarProducto(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(204).json({ mensaje: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}