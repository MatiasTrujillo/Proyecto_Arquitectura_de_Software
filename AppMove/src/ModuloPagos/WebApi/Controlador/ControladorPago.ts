import { Request, Response } from "express";
import { ServicioPago } from "../../Servicio/ServicioPago";
import { RepositorioPago } from "../../DataAccess/RepositorioPago";
import { IServicioPago } from "../../IServicio/IServicioPago";

export class ControladorPago {
  private servicioPago: IServicioPago;

  constructor(servicioPago?: IServicioPago) {
    this.servicioPago = servicioPago ?? new ServicioPago(new RepositorioPago());
  }
  crearPago(req: Request, res: Response): void {
    try {
      const { fecha, monto, estado } = req.body;
      const pagoCreado = this.servicioPago.crearPago(fecha, monto, estado);

      res.status(201).json({ data: this.mapPago(pagoCreado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerPago(req: Request, res: Response): void {
    try {
      const pagos = this.servicioPago.obtenerPagos();
      res.status(200).json({ data: pagos.map(pago => this.mapPago(pago)) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerPagoPorId(req: Request, res: Response): void {
    try {
      const id = Number(req.params.id);
      const pago = this.servicioPago.obtenerPagoPorId(id);
      res.status(200).json({ data: this.mapPago(pago) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarPago(req: Request, res: Response): void {
    try {
      const id = Number(req.params.id);
      const { fecha, monto, estado } = req.body;
      const pagoActualizado = this.servicioPago.actualizarPago(id, fecha, monto, estado);

      res.status(200).json({ data: this.mapPago(pagoActualizado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarPago(req: Request, res: Response): void {
    try {
      const id = Number(req.params.id);
      this.servicioPago.eliminarPago(id);
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
