import { Request, Response } from "express";
import { ServicioProducto } from "../../Servicio/ServicioProducto";
import { RepositorioProducto } from "../../DataAccess/RepositorioProducto";

export class ControladorProducto {
  private servicio: ServicioProducto;

  constructor() {
    this.servicio = new ServicioProducto(new RepositorioProducto());
  }

  async crearProducto(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.body;
      const producto = await this.servicio.crearProducto(nombre);
      res.status(201).json({ data: producto });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  async obtenerProducto(_req: Request, res: Response): Promise<void> {
    try {
      const productos = await this.servicio.obtenerProductos();
      res.status(200).json({ data: productos });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  async obtenerProductoPorId(req: Request, res: Response): Promise<void> {
    try {
      const producto = await this.servicio.obtenerProductoPorId(Number(req.params.id));
      res.status(200).json({ data: producto });
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  async actualizarProducto(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.body;
      const producto = await this.servicio.actualizarProducto(Number(req.params.id), nombre);
      res.status(200).json({ data: producto });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  async eliminarProducto(req: Request, res: Response): Promise<void> {
    try {
      await this.servicio.eliminarProducto(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }
}
