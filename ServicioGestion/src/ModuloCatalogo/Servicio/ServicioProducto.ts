import { ProductoDTO } from "../DTOs/ProductoDTO";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";
import { IServicioProducto } from "../IServicio/IServicioProducto";

export class ServicioProducto implements IServicioProducto {
  constructor(private repositorio: IRepositorioProducto) {}

  async crearProducto(nombre: string): Promise<ProductoDTO> {
    const nombreValido = this.validarNombre(nombre);
    const producto = await this.repositorio.crearProducto(nombreValido);
    return ProductoDTO.fromEntity(producto);
  }

  async obtenerProductos(): Promise<ProductoDTO[]> {
    const productos = await this.repositorio.obtenerProductos();
    return productos.map(p => ProductoDTO.fromEntity(p));
  }

  async obtenerProductoPorId(id: number): Promise<ProductoDTO> {
    const producto = await this.repositorio.obtenerProductoPorId(id);
    if (!producto) throw new Error(`No se encontró el producto con id ${id}`);
    return ProductoDTO.fromEntity(producto);
  }

  async actualizarProducto(id: number, nombre: string): Promise<ProductoDTO> {
    if (!await this.repositorio.existe(id)) throw new Error(`No se encontró el producto con id ${id}`);
    const nombreValido = this.validarNombre(nombre);
    const actualizado = await this.repositorio.actualizarProducto(id, nombreValido);
    if (!actualizado) throw new Error(`No se pudo actualizar el producto con id ${id}`);
    return ProductoDTO.fromEntity(actualizado);
  }

  async eliminarProducto(id: number): Promise<void> {
    if (!await this.repositorio.existe(id)) throw new Error(`No se encontró el producto con id ${id}`);
    await this.repositorio.eliminarProducto(id);
  }

  private validarNombre(nombre: string): string {
    if (!nombre || nombre.trim().length === 0) throw new Error("El nombre del producto no puede estar vacío");
    return nombre.trim();
  }
}
