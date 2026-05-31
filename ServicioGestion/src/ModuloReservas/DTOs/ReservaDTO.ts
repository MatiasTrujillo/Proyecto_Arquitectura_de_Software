import { Reserva } from "../Dominio/Reserva";

export class ReservaDTO {
  cliente: string;
  origen: string;
  destino: string;
  fecha: Date;
  estado: string;
  costo: number;
  vehiculo: string;
  productos: string[];
  conductor: string;
  categorias: string[];

  constructor(
    cliente: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    costo: number,
    vehiculo: string,
    productos: string[],
    conductor: string,
    categorias: string[]
  ) {
    this.cliente = cliente;
    this.origen = origen;
    this.destino = destino;
    this.fecha = fecha;
    this.estado = estado;
    this.costo = costo;
    this.vehiculo = vehiculo;
    this.productos = productos;
    this.conductor = conductor;
    this.categorias = categorias;
  }

  static fromEntity(entidad: Reserva): ReservaDTO {
    return new ReservaDTO(
      entidad.getCliente(),
      entidad.getOrigen(),
      entidad.getDestino(),
      entidad.getFecha(),
      entidad.getEstado(),
      entidad.getCosto(),
      entidad.getVehiculo(),
      entidad.getProductos(),
      entidad.getConductor(),
      entidad.getCategorias()
    );
  }

  toEntity(): Reserva {
    return new Reserva(
      this.cliente,
      this.origen,
      this.destino,
      this.fecha,
      this.estado,
      this.costo,
      this.vehiculo,
      this.productos,
      this.conductor,
      this.categorias
    );
  }
}
