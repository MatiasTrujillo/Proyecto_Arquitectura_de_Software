import { PreregistroProducto } from "../Dominio/PreregistroProducto";

export interface IRepositorioPreregistroProducto {
  crear(clienteEmpresaId: string, productoId: number, productoNombre: string, descripcion: string, valor: number | null, tamano: number | null, categoria: string | null): Promise<PreregistroProducto>;
  obtenerPorEmpresa(clienteEmpresaId: string): Promise<PreregistroProducto[]>;
  obtenerPorEmpresaYProducto(clienteEmpresaId: string, productoId: number): Promise<PreregistroProducto | undefined>;
  eliminar(id: number, clienteEmpresaId: string): Promise<boolean>;
  existe(id: number, clienteEmpresaId: string): Promise<boolean>;
}
