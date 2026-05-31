import { Conductor } from "../Dominio/Conductor";
import { IRepositorioConductor } from "../IDataAccess/IRepositorioConductor";

export class RepositorioConductor implements IRepositorioConductor {
  private conductores: Conductor[] = [];
  private siguienteId: number = 1;

  crearConductor(cedula: string, nombre: string): Conductor {
    const nuevoConductor = new Conductor(String(this.siguienteId++), cedula, nombre);
    this.conductores.push(nuevoConductor);
    return nuevoConductor;
  }

  obtenerConductores(): Conductor[] {
    return this.conductores;
  }

  obtenerConductorPorId(id: string): Conductor | undefined {
    return this.conductores.find(conductor => conductor.getId() === id);
  }

  actualizarConductor(id: string, cedula: string, nombre: string): Conductor | undefined {
    const index = this.conductores.findIndex(conductor => conductor.getId() === id);
    if (index === -1) {
      return undefined;
    }

    const conductorActualizado = new Conductor(id, cedula, nombre);
    this.conductores[index] = conductorActualizado;
    return conductorActualizado;
  }

  eliminarConductor(id: string): boolean {
    const index = this.conductores.findIndex(conductor => conductor.getId() === id);
    if (index === -1) {
      return false;
    }

    this.conductores.splice(index, 1);
    return true;
  }

  existe(id: string): boolean {
    return this.conductores.some(conductor => conductor.getId() === id);
  }
}
