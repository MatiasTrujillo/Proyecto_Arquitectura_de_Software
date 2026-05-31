import { Request, Response } from "express";
import { ServicioOperador } from "../../Servicio/ServicioOperador";
import { RepositorioOperador } from "../../DataAccess/RepositorioOperador";
import { IServicioOperador } from "../../IServicio/IServicioOperador";

export class ControladorOperador {
  private servicioOperador: IServicioOperador;

  constructor(servicioOperador?: IServicioOperador) {
    this.servicioOperador = servicioOperador ?? new ServicioOperador(new RepositorioOperador());
  }

  crearOperador(req: Request, res: Response): void {
    try {
      const { cedula, nombre } = req.body;
      const operadorCreado = this.servicioOperador.crearOperador(cedula, nombre);
      res.status(201).json({ data: operadorCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerOperador(req: Request, res: Response): void {
    try {
      const operadores = this.servicioOperador.obtenerOperadores();
      res.status(200).json({ data: operadores });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerOperadorPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const operador = this.servicioOperador.obtenerOperadorPorId(id as string);
      res.status(200).json({ data: operador });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarOperador(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const operadorActualizado = this.servicioOperador.actualizarOperador(id as string, cedula, nombre);
      res.status(200).json({ data: operadorActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarOperador(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      this.servicioOperador.eliminarOperador(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  asignarReserva(req: Request, res: Response): void {
    try {
      const { reservaId } = req.params;
      res.status(200).json({ mensaje: "Reserva asignada" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  consultarTraslado(req: Request, res: Response): void {
    try {
      const { trasladoId } = req.params;
      res.status(200).json({ data: {} });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  reservaNoReconocida(req: Request, res: Response): void {
    try {
      const { reservaId } = req.params;
      res.status(200).json({ mensaje: "Reserva marcada como no reconocida" });
    } catch (error) {
      this.manejarError(res, error);
    }
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
