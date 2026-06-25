export class Reserva {
  private id: string;
  private cliente: string; // UsuarioId
  private origen: string; // ZonaGeograficaId
  private destino: string; // ZonaGeograficaId
  private fecha: Date;
  private estado: string;
  private costo: number; // int en TypeScript es number
  private vehiculo: string | null;
  private productos: string[]; // List<ProductoId>
  private conductor: string | null;
  private categorias: string[]; // List<CategoriaId>

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

  // Getters
  obtenerId(): string {
    return this.id;
  }

  obtenerCliente(): string {
    return this.cliente;
  }

  obtenerOrigen(): string {
    return this.origen;
  }

  obtenerDestino(): string {
    return this.destino;
  }

  obtenerFecha(): Date {
    return this.fecha;
  }

  obtenerEstado(): string {
    return this.estado;
  }

  obtenerCosto(): number {
    return this.costo;
  }

  obtenerVehiculo(): string | null {
    return this.vehiculo;
  }

  obtenerProductos(): string[] {
    return this.productos;
  }

  obtenerConductor(): string | null {
    return this.conductor;
  }

  obtenerCategorias(): string[] {
    return this.categorias;
  }

  // Setters
  setEstado(estado: string): void {
    this.estado = estado;
  }

  setCosto(costo: number): void {
    this.costo = costo;
  }
}