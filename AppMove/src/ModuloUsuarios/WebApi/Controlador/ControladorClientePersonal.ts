import { Request, Response } from "express";
import { ServicioClientePersonal } from "../../Servicio/ServicioClientePersonal";
import { RepositorioClientePersonal } from "../../DataAccess/RepositorioClientePersonal";
import { IServicioClientePersonal } from "../../IServicio/IServicioClientePersonal";

export class ControladorClientePersonal {
  private servicioClientePersonal: IServicioClientePersonal;

  constructor(servicioClientePersonal?: IServicioClientePersonal) {
    this.servicioClientePersonal = servicioClientePersonal ?? new ServicioClientePersonal(new RepositorioClientePersonal());
  }

  crearClientePersonal(req: Request, res: Response): void {
    try {
      const { cedula, nombre } = req.body;
      const clienteCreado = this.servicioClientePersonal.crearClientePersonal(cedula, nombre);
      res.status(201).json({ data: this.mapClientePersonal(clienteCreado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerClientePersonal(req: Request, res: Response): void {
    try {
      const clientes = this.servicioClientePersonal.obtenerClientePersonales();
      res.status(200).json({ data: clientes.map(cliente => this.mapClientePersonal(cliente)) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerClientePersonalPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const cliente = this.servicioClientePersonal.obtenerClientePersonalPorId(id as string);
      res.status(200).json({ data: this.mapClientePersonal(cliente) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarClientePersonal(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const clienteActualizado = this.servicioClientePersonal.actualizarClientePersonal(id as string, cedula, nombre);
      res.status(200).json({ data: this.mapClientePersonal(clienteActualizado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarClientePersonal(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      this.servicioClientePersonal.eliminarClientePersonal(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  calcularTraslado(req: Request, res: Response): void {
    try {
      const { origen, destino } = req.body;
      res.status(200).json({ data: { costo: 0, tiempo: 0 } });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  realizarReserva(req: Request, res: Response): void {
    try {
      res.status(201).json({ mensaje: "Reserva realizada" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerReservas(req: Request, res: Response): void {
    try {
      const { clienteId } = req.params;
      res.status(200).json({ data: [] });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private mapClientePersonal(cliente: any) {
    return {
      id: cliente.getId(),
      cedula: cliente.getCedula(),
      nombre: cliente.getNombre(),
      rol: cliente.obtenerRol(),
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
