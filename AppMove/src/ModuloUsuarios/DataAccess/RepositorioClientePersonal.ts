import { ClientePersonal } from "../Dominio/ClientePersonal";
import { IRepositorioClientePersonal } from "../IDataAccess/IRepositorioClientePersonal";

export class RepositorioClientePersonal implements IRepositorioClientePersonal {
  private clientes: ClientePersonal[] = [];
  private siguienteId: number = 1;

  crearClientePersonal(cedula: string, nombre: string): ClientePersonal {
    const nuevoCliente = new ClientePersonal(String(this.siguienteId++), cedula, nombre);
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }

  obtenerClientePersonales(): ClientePersonal[] {
    return this.clientes;
  }

  obtenerClientePersonalPorId(id: string): ClientePersonal | undefined {
    return this.clientes.find(cliente => cliente.getId() === id);
  }

  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonal | undefined {
    const indice = this.clientes.findIndex(cliente => cliente.getId() === id);
    if (indice === -1) {
      return undefined;
    }

    const clienteActualizado = new ClientePersonal(id, cedula, nombre);
    this.clientes[indice] = clienteActualizado;
    return clienteActualizado;
  }

  eliminarClientePersonal(id: string): boolean {
    const indice = this.clientes.findIndex(cliente => cliente.getId() === id);
    if (indice === -1) {
      return false;
    }

    this.clientes.splice(indice, 1);
    return true;
  }

  existe(id: string): boolean {
    return this.clientes.some(cliente => cliente.getId() === id);
  }
}
