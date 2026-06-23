export class PreregistroProducto {
  constructor(
    public readonly id: number,
    public readonly clienteEmpresaId: string,
    public readonly productoId: number,
    public readonly productoNombre: string,
    public readonly descripcion: string,
    public readonly valor: number | null,
    public readonly tamano: number | null,
    public readonly categoria: string | null,
  ) {}
}
