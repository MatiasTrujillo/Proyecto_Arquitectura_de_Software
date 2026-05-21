import { Request, Response } from "express";
import { ServicioClienteEmpresa } from "../../Servicio/ServicioClienteEmpresa";
import { RepositorioClienteEmpresa } from "../../DataAccess/RepositorioClienteEmpresa";
import { IServicioClienteEmpresa } from "../../IServicio/IServicioClienteEmpresa";

export class ControladorClienteEmpresa {
  private servicioClienteEmpresa: IServicioClienteEmpresa;

  constructor(servicioClienteEmpresa?: IServicioClienteEmpresa) {
    this.servicioClienteEmpresa = servicioClienteEmpresa ?? new ServicioClienteEmpresa(new RepositorioClienteEmpresa());
  }

  crearClienteEmpresa(req: Request, res: Response): void {
    try {
      const { cedula, nombre } = req.body;
      const clienteCreado = this.servicioClienteEmpresa.crearClienteEmpresa(cedula, nombre);
      res.status(201).json({ data: this.mapClienteEmpresa(clienteCreado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerClienteEmpresa(req: Request, res: Response): void {
    try {
      const clientes = this.servicioClienteEmpresa.obtenerClienteEmpresas();
      res.status(200).json({ data: clientes.map(cliente => this.mapClienteEmpresa(cliente)) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerClienteEmpresaPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const cliente = this.servicioClienteEmpresa.obtenerClienteEmpresaPorId(id);
      res.status(200).json({ data: this.mapClienteEmpresa(cliente) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarClienteEmpresa(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const clienteActualizado = this.servicioClienteEmpresa.actualizarClienteEmpresa(id, cedula, nombre);
      res.status(200).json({ data: this.mapClienteEmpresa(clienteActualizado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarClienteEmpresa(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      this.servicioClienteEmpresa.eliminarClienteEmpresa(id);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  calcularTraslado(req: Request, res: Response): void {
    try {
      const { origen, destino } = req.body;
      // Lógica para calcular traslado
      res.status(200).json({ data: { costo: 0, tiempo: 0 } });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  realizarReserva(req: Request, res: Response): void {
    try {
      // Lógica para realizar reserva
      res.status(201).json({ mensaje: "Reserva realizada" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  obtenerReservas(req: Request, res: Response): void {
    try {
      const { clienteId } = req.params;
      res.status(200).json({ data: [] });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  asociarProducto(req: Request, res: Response): void {
    try {
      const { clienteId, productoId } = req.body;
      res.status(200).json({ mensaje: "Producto asociado al clienteEmpresa" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  registrarOrigenFrecuente(req: Request, res: Response): void {
    try {
      const { clienteId, origen } = req.body;
      res.status(201).json({ mensaje: "Origen frecuente registrado" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  registrarDestinoFrecuente(req: Request, res: Response): void {
    try {
      const { clienteId, destino } = req.body;
      res.status(201).json({ mensaje: "Destino frecuente registrado" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private mapClienteEmpresa(cliente: any) {
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