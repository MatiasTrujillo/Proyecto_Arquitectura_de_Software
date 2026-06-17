export class Reserva {
  private id: string;
  private cliente: string; // UsuarioId
  private origen: string; // ZonaGeograficaId
  private destino: string; // ZonaGeograficaId
  private fecha: Date;
  private estado: string;
  private costo: number; // int en TypeScript es number
  private vehiculo: string; // VehiculoId
  private productos: string[]; // List<ProductoId>
  private conductor: string; // ConductorId
  private categorias: string[]; // List<CategoriaId>

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

  // Getters
  getId(): string {
    return this.id;
  }

  getCliente(): string {
    return this.cliente;
  }

  getOrigen(): string {
    return this.origen;
  }

  getDestino(): string {
    return this.destino;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getEstado(): string {
    return this.estado;
  }

  getCosto(): number {
    return this.costo;
  }

  getVehiculo(): string {
    return this.vehiculo;
  }

  getProductos(): string[] {
    return this.productos;
  }

  getConductor(): string {
    return this.conductor;
  }

  getCategorias(): string[] {
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