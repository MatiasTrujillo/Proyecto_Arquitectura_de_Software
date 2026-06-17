import { Request, Response } from "express";
import { ServicioVehiculo } from "../../Servicio/ServicioVehiculo";
import { RepositorioVehiculo } from "../../DataAccess/RepositorioVehiculo";
import { IServicioVehiculo } from "../../IServicio/IServicioVehiculo";

export class ControladorVehiculo {
  private servicioVehiculo: IServicioVehiculo;

  constructor(servicioVehiculo?: IServicioVehiculo) {
    this.servicioVehiculo = servicioVehiculo ?? new ServicioVehiculo(new RepositorioVehiculo());
  }

  async crearVehiculo(req: Request, res: Response): Promise<void> {
    try {
      const { matricula, tipo, capacidad, dispositivoGPS, disponible, caracteristicas } = req.body;
      const vehiculo = await this.servicioVehiculo.crearVehiculo(matricula, tipo, Number(capacidad), dispositivoGPS ?? '', disponible ?? true, caracteristicas ?? {});
      res.status(201).json({ data: vehiculo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerVehiculos(req: Request, res: Response): Promise<void> {
    try {
      const vehiculos = await this.servicioVehiculo.obtenerVehiculos();
      res.status(200).json({ data: vehiculos });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerVehiculoPorId(req: Request, res: Response): Promise<void> {
    try {
      const vehiculo = await this.servicioVehiculo.obtenerVehiculoPorId(req.params.id as string);
      res.status(200).json({ data: vehiculo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarVehiculo(req: Request, res: Response): Promise<void> {
    try {
      const { matricula, tipo, capacidad, dispositivoGPS, disponible, caracteristicas } = req.body;
      const vehiculo = await this.servicioVehiculo.actualizarVehiculo(req.params.id as string, matricula, tipo, Number(capacidad), dispositivoGPS ?? '', disponible ?? true, caracteristicas ?? {});
      res.status(200).json({ data: vehiculo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarVehiculo(req: Request, res: Response): Promise<void> {
    try {
      await this.servicioVehiculo.eliminarVehiculo(req.params.id as string);
      res.status(204).send();
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
