import { Operador } from "../Dominio/Operador";
import { IRepositorioOperador } from "../IDataAccess/IRepositorioOperador";

export class RepositorioOperador implements IRepositorioOperador {
  private operadores: Operador[] = [];
  private siguienteId: number = 1;

  crearOperador(cedula: string, nombre: string): Operador {
    const nuevoOperador = new Operador(String(this.siguienteId++), cedula, nombre);
    this.operadores.push(nuevoOperador);
    return nuevoOperador;
  }

  obtenerOperadores(): Operador[] {
    return this.operadores;
  }

  obtenerOperadorPorId(id: string): Operador | undefined {
    return this.operadores.find(operador => operador.getId() === id);
  }

  actualizarOperador(id: string, cedula: string, nombre: string): Operador | undefined {
    const index = this.operadores.findIndex(operador => operador.getId() === id);
    if (index === -1) {
      return undefined;
    }

    const operadorActualizado = new Operador(id, cedula, nombre);
    this.operadores[index] = operadorActualizado;
    return operadorActualizado;
  }

  eliminarOperador(id: string): boolean {
    const index = this.operadores.findIndex(operador => operador.getId() === id);
    if (index === -1) {
      return false;
    }

    this.operadores.splice(index, 1);
    return true;
  }

  existe(id: string): boolean {
    return this.operadores.some(operador => operador.getId() === id);
  }
}
