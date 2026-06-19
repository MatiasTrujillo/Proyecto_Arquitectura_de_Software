import { Request, Response } from "express";
import { ServicioOperador } from "../../Servicio/ServicioOperador";
import { RepositorioOperador } from "../../DataAccess/RepositorioOperador";
import { IServicioOperador } from "../../IServicio/IServicioOperador";

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

async function registrarCredencial(cedula: string, password: string, rol: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/api/auth/registrar-interno`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ cedula, password, rol }),
  });
  if (res.ok) return;
  const err = await res.json().catch(() => ({}));
  const mensaje = (err as any).error || '';
  if (/ya existe/i.test(mensaje)) return;
  throw new Error(mensaje || 'Error al crear credencial en ServicioAutenticacion');
}

export class ControladorOperador {
  private servicioOperador: IServicioOperador;

  constructor(servicioOperador?: IServicioOperador) {
    this.servicioOperador = servicioOperador ?? new ServicioOperador(new RepositorioOperador());
  }

  async crearOperador(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, nombre, password } = req.body;
      if (!password) {
        res.status(400).json({ error: 'La contraseña es requerida para crear un operador' });
        return;
      }
      const operadorCreado = await this.servicioOperador.crearOperador(cedula, nombre);
      await registrarCredencial(cedula, password, 'Operador');
      res.status(201).json({ data: operadorCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerOperador(req: Request, res: Response): Promise<void> {
    try {
      const operadores = await this.servicioOperador.obtenerOperadores();
      res.status(200).json({ data: operadores });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerOperadorPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const operador = await this.servicioOperador.obtenerOperadorPorId(id as string);
      res.status(200).json({ data: operador });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarOperador(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const operadorActualizado = await this.servicioOperador.actualizarOperador(id as string, cedula, nombre);
      res.status(200).json({ data: operadorActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarOperador(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicioOperador.eliminarOperador(id as string);
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
