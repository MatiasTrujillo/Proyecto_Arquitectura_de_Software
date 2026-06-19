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
      const { descripcion, valor, tamano, categoria } = req.body;
      const producto = await this.servicio.crearProducto(descripcion, Number(valor), Number(tamano), categoria);
      res.status(201).json({ data: producto });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: mensaje });
    }
  }

  async obtenerProducto(_req: Request, res: Response): Promise<void> {
    try {
      const productos = await this.servicio.obtenerProductos();
      res.status(200).json({ data: productos });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: mensaje });
    }
  }

  async obtenerProductoPorId(req: Request, res: Response): Promise<void> {
    try {
      const producto = await this.servicio.obtenerProductoPorId(Number(req.params.id));
      if (!producto) { res.status(404).json({ error: 'Producto no encontrado' }); return; }
      res.status(200).json({ data: producto });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: mensaje });
    }
  }

  async actualizarProducto(req: Request, res: Response): Promise<void> {
    try {
      const { descripcion, valor, tamano, categoria } = req.body;
      const producto = await this.servicio.actualizarProducto(Number(req.params.id), descripcion, Number(valor), Number(tamano), categoria);
      res.status(200).json({ data: producto });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: mensaje });
    }
  }

  async eliminarProducto(req: Request, res: Response): Promise<void> {
    try {
      await this.servicio.eliminarProducto(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: mensaje });
    }
  }
}
