import { Request, Response } from "express";
import { ServicioOperador } from "../../Servicio/ServicioOperador";
import { RepositorioOperador } from "../../DataAccess/RepositorioOperador";
import { IServicioOperador } from "../../IServicio/IServicioOperador";
import pool from "../../../Shared/Database/DatabaseConnection";

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

async function registrarCredencial(cedula: string, email: string, password: string, rol: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/api/auth/registrar-interno`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ cedula, email, password, rol }),
  });
  if (res.ok) return;
  const err = await res.json().catch(() => ({}));
  const mensaje = (err as any).error || '';
  if (/ya existe.*email/i.test(mensaje) || /already exists/i.test(mensaje)) return;
  throw new Error(mensaje || 'Error al crear credencial en ServicioAutenticacion');
}

export class ControladorOperador {
  private servicioOperador: IServicioOperador;

  constructor(servicioOperador?: IServicioOperador) {
    this.servicioOperador = servicioOperador ?? new ServicioOperador(new RepositorioOperador());
  }

  crearOperador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cedula, nombre, email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'El email y la contraseña son requeridos para crear un operador' });
        return;
      }
      const tablasCed = ['administrador', 'conductor', 'operador', 'cliente_personal', 'cliente_empresa'];
      for (const tabla of tablasCed) {
        const r = await pool.query(`SELECT 1 FROM ${tabla} WHERE cedula = $1`, [cedula]);
        if ((r.rowCount ?? 0) > 0) {
          res.status(400).json({ error: `Ya existe un usuario con la cédula ${cedula}` });
          return;
        }
      }
      await registrarCredencial(cedula, email, password, 'Operador');
      const operadorCreado = await this.servicioOperador.crearOperador(cedula, nombre, email);
      res.status(201).json({ data: operadorCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerOperador = async (req: Request, res: Response): Promise<void> => {
    try {
      const operadores = await this.servicioOperador.obtenerOperadores();
      res.status(200).json({ data: operadores });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerOperadorPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const operador = await this.servicioOperador.obtenerOperadorPorId(id as string);
      res.status(200).json({ data: operador });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarOperador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const operadorActualizado = await this.servicioOperador.actualizarOperador(id as string, cedula, nombre);
      res.status(200).json({ data: operadorActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarOperador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.servicioOperador.eliminarOperador(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  asignarReserva = (req: Request, res: Response): void => {
    try {
      const { reservaId } = req.params;
      res.status(200).json({ mensaje: "Reserva asignada" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  reservaNoReconocida = (req: Request, res: Response): void => {
    try {
      const { reservaId } = req.params;
      res.status(200).json({ mensaje: "Reserva marcada como no reconocida" });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private manejarError = (res: Response, error: unknown): void => {
    const mensaje = error instanceof Error ? error.message : String(error);

    if (/no se encontr|no encontrado/i.test(mensaje)) {
      res.status(404).json({ error: mensaje });
      return;
    }

    res.status(400).json({ error: mensaje });
  }
}
