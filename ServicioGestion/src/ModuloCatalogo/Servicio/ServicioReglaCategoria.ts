import { RepositorioReglaCategoria } from "../DataAccess/RepositorioReglaCategoria";
import { RepositorioCategoria } from "../DataAccess/RepositorioCategoria";
import { ReglaDTO } from "../DTOs/ReglaDTO";
import { CategoriaDTO } from "../DTOs/CategoriaDTO";

const MAX_REGLAS = 5;

export class ServicioReglaCategoria {
  private repo = new RepositorioReglaCategoria();
  private repoCategoria = new RepositorioCategoria();

  async obtenerReglas(): Promise<ReglaDTO[]> {
    return this.repo.obtenerTodas();
  }

  async obtenerCategorias(): Promise<CategoriaDTO[]> {
    const cats = await this.repoCategoria.obtenerTodas();
    return cats.map(c => CategoriaDTO.fromEntity(c));
  }

  async crearCategoria(nombre: string, nombreEs: string, descripcion: string): Promise<CategoriaDTO> {
    if (!nombre?.trim()) throw new Error('El nombre es obligatorio');
    if (!nombreEs?.trim()) throw new Error('El nombre en español es obligatorio');
    const cat = await this.repoCategoria.crear(nombre.trim(), nombreEs.trim(), descripcion?.trim() ?? '');
    return CategoriaDTO.fromEntity(cat);
  }

  async crearRegla(categoriaId: number, requiereMonitoreo: boolean, generaAlertas: boolean, recargoPorcentaje: number): Promise<ReglaDTO> {
    const total = await this.repo.contarReglas();
    if (total >= MAX_REGLAS) throw new Error(`No se pueden definir más de ${MAX_REGLAS} reglas`);

    const existente = await this.repo.obtenerPorCategoria(categoriaId);
    if (existente) throw new Error('Esta categoría ya tiene una regla definida');

    const cat = await this.repoCategoria.obtenerPorId(categoriaId);
    if (!cat) throw new Error('Categoría no encontrada');

    if (recargoPorcentaje < 0 || recargoPorcentaje > 100)
      throw new Error('El recargo debe estar entre 0 y 100');

    return this.repo.crear(categoriaId, requiereMonitoreo, generaAlertas, recargoPorcentaje);
  }

  async actualizarRegla(id: number, requiereMonitoreo: boolean, generaAlertas: boolean, recargoPorcentaje: number): Promise<ReglaDTO> {
    const regla = await this.repo.obtenerPorId(id);
    if (!regla) throw new Error('Regla no encontrada');
    if (recargoPorcentaje < 0 || recargoPorcentaje > 100)
      throw new Error('El recargo debe estar entre 0 y 100');
    return (await this.repo.actualizar(id, requiereMonitoreo, generaAlertas, recargoPorcentaje))!;
  }

  async eliminarRegla(id: number): Promise<void> {
    const regla = await this.repo.obtenerPorId(id);
    if (!regla) throw new Error('Regla no encontrada');

    const usada = await this.repo.fueUsadaEnReserva(regla.categoriaId);
    if (usada) throw new Error('No se puede eliminar: esta regla fue utilizada en reservas anteriores');

    await this.repo.eliminar(id);
  }
}
