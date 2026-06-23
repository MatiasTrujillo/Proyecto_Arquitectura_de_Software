import { PreregistroProducto } from '../Dominio/PreregistroProducto';
import { IRepositorioPreregistroProducto } from '../IDataAccess/IRepositorioPreregistroProducto';
import { clasificarRapido } from '../../ModuloCatalogo/Servicio/ServicioClasificacion';

export class ServicioPreregistroProducto {
  constructor(private repositorio: IRepositorioPreregistroProducto) {}

  async crearPreregistro(
    clienteEmpresaId: string,
    productoId: number,
    productoNombre: string,
    descripcion: string,
    valor: number | null,
    tamano: number | null,
  ): Promise<PreregistroProducto> {
    if (!descripcion || descripcion.trim().length === 0) {
      throw new Error('La descripción es obligatoria');
    }

    const resultados = await clasificarRapido(descripcion.trim());
    const categoriaEncontrada = resultados.find(r => r.categoria !== null)?.categoria ?? null;

    return this.repositorio.crear(
      clienteEmpresaId, productoId, productoNombre,
      descripcion.trim(), valor, tamano, categoriaEncontrada
    );
  }

  async obtenerPreregistros(clienteEmpresaId: string): Promise<PreregistroProducto[]> {
    return this.repositorio.obtenerPorEmpresa(clienteEmpresaId);
  }

  async obtenerPreregistroPorProducto(clienteEmpresaId: string, productoId: number): Promise<PreregistroProducto | undefined> {
    return this.repositorio.obtenerPorEmpresaYProducto(clienteEmpresaId, productoId);
  }

  async eliminarPreregistro(id: number, clienteEmpresaId: string): Promise<void> {
    const eliminado = await this.repositorio.eliminar(id, clienteEmpresaId);
    if (!eliminado) throw new Error('Preregistro no encontrado o no pertenece a esta empresa');
  }
}
