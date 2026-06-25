import { Request, Response } from "express";
import { ServicioConductor } from "../../Servicio/ServicioConductor";
import { RepositorioConductor } from "../../DataAccess/RepositorioConductor";
import { IServicioConductor } from "../../IServicio/IServicioConductor";
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

export class ControladorConductor {
  private servicioConductor: IServicioConductor;

  constructor(servicioConductor?: IServicioConductor) {
    this.servicioConductor = servicioConductor ?? new ServicioConductor(new RepositorioConductor());
  }

  crearConductor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cedula, nombre, email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'El email y la contraseña son requeridos para crear un conductor' });
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
      await registrarCredencial(cedula, email, password, 'Conductor');
      const conductorCreado = await this.servicioConductor.crearConductor(cedula, nombre, email);
      res.status(201).json({ data: conductorCreado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerConductor = async (_req: Request, res: Response): Promise<void> => {
    try {
      const conductores = await this.servicioConductor.obtenerConductores();
      res.status(200).json({ data: conductores });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerConductoresDisponibles = async (_req: Request, res: Response): Promise<void> => {
    try {
      const conductores = await this.servicioConductor.obtenerConductoresDisponibles();
      res.status(200).json({ data: conductores });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerConductorPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const conductor = await this.servicioConductor.obtenerConductorPorId(id as string);
      res.status(200).json({ data: conductor });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarConductor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const conductorActualizado = await this.servicioConductor.actualizarConductor(id as string, cedula, nombre);
      res.status(200).json({ data: conductorActualizado });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarConductor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.servicioConductor.eliminarConductor(id as string);
      res.status(204).send();
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
