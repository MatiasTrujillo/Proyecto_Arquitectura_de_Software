import { Request, Response } from "express";
import { ServicioVehiculo } from "../../Servicio/ServicioVehiculo";
import { RepositorioVehiculo } from "../../DataAccess/RepositorioVehiculo";
import { IServicioVehiculo } from "../../IServicio/IServicioVehiculo";

export class ControladorVehiculo {
  private servicio: IServicioVehiculo;

  constructor(servicio?: IServicioVehiculo) {
    this.servicio = servicio ?? new ServicioVehiculo(new RepositorioVehiculo());
  }

  async crearVehiculo(req: Request, res: Response): Promise<void> {
    try {
      const { matricula, tipo, capacidad, dispositivoGps } = req.body;
      const vehiculoDTO = await this.servicio.crearVehiculo(matricula, tipo, capacidad, dispositivoGps);
      res.status(201).json({ data: vehiculoDTO });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerVehiculos(req: Request, res: Response): Promise<void> {
    try {
      const vehiculos = await this.servicio.obtenerVehiculos();
      res.status(200).json({ data: vehiculos });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerVehiculoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vehiculo = await this.servicio.obtenerVehiculoPorId(Number(id));
      res.status(200).json({ data: vehiculo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarVehiculo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { matricula, tipo, capacidad, dispositivoGps } = req.body;
      const vehiculoDTO = await this.servicio.actualizarVehiculo(Number(id), matricula, tipo, capacidad, dispositivoGps);
      res.status(200).json({ data: vehiculoDTO });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerVehiculoPorMatricula(req: Request, res: Response): Promise<void> {
    try {
      const vehiculo = await this.servicio.obtenerVehiculoPorMatricula(req.params.matricula);
      res.status(200).json({ data: vehiculo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarVehiculo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicio.eliminarVehiculo(Number(id));
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private manejarError(res: Response, error: any): void {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error });
    }
  }
}
