export class Producto {
  private id: number;
  private descripcion : string;
  private valor: number | null;
  private tamano : number; //debe ser opcional
  private categoria : string; //categoria

  constructor(id: number, descripcion: string, valor: number | null, tamano: number, categoria: string) {
    this.id = id;
    this.descripcion = descripcion;
    this.valor = valor;
    this.tamano = tamano;
    this.categoria = categoria;
  }

  getId(): number {
    return this.id;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getValor(): number | null {
    return this.valor;
  }

  getTamano(): number {
    return this.tamano;
  }

  getCategoria(): string {
    return this.categoria;
  }
}