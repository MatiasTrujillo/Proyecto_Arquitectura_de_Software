import { Request, Response } from "express";

export class ControladorVehiculo {
  crearVehiculo(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Vehículo creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerVehiculos(req: Request, res: Response): void {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerVehiculoPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarVehiculo(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(200).json({ mensaje: "Vehículo actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarVehiculo(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      res.status(204).json({ mensaje: "Vehículo eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
