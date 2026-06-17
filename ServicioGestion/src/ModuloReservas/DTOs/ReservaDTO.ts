import { Reserva } from "../Dominio/Reserva";

export class ReservaDTO {
  id: string;
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
    id: string,
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
    this.id = id;
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
      entidad.getId(),
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
      this.id,
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
