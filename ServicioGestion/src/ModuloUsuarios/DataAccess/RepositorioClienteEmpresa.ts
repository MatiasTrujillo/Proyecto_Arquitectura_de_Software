import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";
import { IRepositorioClienteEmpresa } from "../IDataAccess/IRepositorioClienteEmpresa";

export class RepositorioClienteEmpresa implements IRepositorioClienteEmpresa {
  private clientes: ClienteEmpresa[] = [];
  private siguienteId: number = 1;

  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresa {
    const nuevoCliente = new ClienteEmpresa(String(this.siguienteId++), cedula, nombre);
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }

  obtenerClienteEmpresas(): ClienteEmpresa[] {
    return this.clientes;
  }

  obtenerClienteEmpresaPorId(id: string): ClienteEmpresa | undefined {
    return this.clientes.find(cliente => cliente.getId() === id);
  }

  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresa | undefined {
    const indice = this.clientes.findIndex(cliente => cliente.getId() === id);
    if (indice === -1) {
      return undefined;
    }

    const clienteActualizado = new ClienteEmpresa(id, cedula, nombre);
    this.clientes[indice] = clienteActualizado;
    return clienteActualizado;
  }

  eliminarClienteEmpresa(id: string): boolean {
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
