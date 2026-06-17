import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";

export class PagoDTO {
  id: number;
  fecha: Date;
  monto: number;
  estado: string;
  reservaId: string;

  constructor(id: number, fecha: Date, monto: number, estado: string, reservaId: string) {
    this.id = id;
    this.fecha = fecha;
    this.monto = monto;
    this.estado = estado;
    this.reservaId = reservaId;
  }

  static fromEntity(entidad: Pago): PagoDTO {
    return new PagoDTO(
      entidad.getId(),
      entidad.getFecha(),
      entidad.getMonto(),
      entidad.getEstado(),
      entidad.getReservaId()
    );
  }

  toEntity(): Pago {
    return new Pago(this.id, this.fecha, this.monto, this.estado as EstadoPago, this.reservaId);
  }
}
