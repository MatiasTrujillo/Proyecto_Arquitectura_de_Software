import { Request, Response } from "express";
import { ServicioPago } from "../../Servicio/ServicioPago";
import { RepositorioPago } from "../../DataAccess/RepositorioPago";
import { IServicioPago } from "../../IServicio/IServicioPago";

export class ControladorPago {
  private servicioPago: IServicioPago;

  constructor(servicioPago?: IServicioPago) {
    this.servicioPago = servicioPago ?? new ServicioPago(new RepositorioPago());
  }

  async crearPago(req: Request, res: Response): Promise<void> {
    try {
      const { fecha, monto, estado } = req.body;
      const pagoCreado = await this.servicioPago.crearPago(fecha, monto, estado); //este await es necesario porque esta .mapPago

      res.status(201).json({ data: this.mapPago(pagoCreado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerPago(req: Request, res: Response): Promise<void> {
    try {
      const pagos = await this.servicioPago.obtenerPagos();
      res.status(200).json({ data: pagos.map(pago => this.mapPago(pago)) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerPagoPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const pago = await this.servicioPago.obtenerPagoPorId(id);
      res.status(200).json({ data: this.mapPago(pago) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarPago(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { fecha, monto, estado } = req.body;
      const pagoActualizado = await this.servicioPago.actualizarPago(id, fecha, monto, estado);

      res.status(200).json({ data: this.mapPago(pagoActualizado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarPago(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.servicioPago.eliminarPago(id);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private mapPago(pago: any) {
    return {
      id: pago.id,
      fecha: pago.fecha,
      monto: pago.monto,
      estado: pago.estado,
    };
  }

  private manejarError(res: Response, error: unknown): void {
    const mensaje = error instanceof Error ? error.message : String(error);

    if (/no se encontr|no encontrado/i.test(mensaje)) { //por ahora leemos el mensaje ya que no hemos creado excepciones personalizadas
      res.status(404).json({ error: mensaje });
      return;
    }

    res.status(400).json({ error: mensaje });
  }
}
