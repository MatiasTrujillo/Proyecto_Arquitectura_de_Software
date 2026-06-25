import { Reserva } from "../Dominio/Reserva";
import { Prioridad } from "../Servicio/ColaPrioridad";

export class ReservaDTO {
  id: string;
  cliente: string;
  origen: string;
  destino: string;
  fecha: Date;
  estado: string;
  costo: number;
  vehiculo: string | null;
  productos: string[];
  conductor: string | null;
  categorias: string[];
  prioridad: Prioridad | null;

  constructor(
    id: string,
    cliente: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    costo: number,
    vehiculo: string | null,
    productos: string[],
    conductor: string | null,
    categorias: string[],
    prioridad: Prioridad | null = null
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
    this.prioridad = prioridad;
  }

  static fromEntity(entidad: Reserva, prioridad: Prioridad | null = null): ReservaDTO {
    return new ReservaDTO(
      entidad.obtenerId(),
      entidad.obtenerCliente(),
      entidad.obtenerOrigen(),
      entidad.obtenerDestino(),
      entidad.obtenerFecha(),
      entidad.obtenerEstado(),
      entidad.obtenerCosto(),
      entidad.obtenerVehiculo(),
      entidad.obtenerProductos(),
      entidad.obtenerConductor(),
      entidad.obtenerCategorias(),
      prioridad
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
