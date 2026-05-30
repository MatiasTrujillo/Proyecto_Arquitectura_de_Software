import assert from "assert";
import { ServicioClienteEmpresa } from "../../src/ModuloUsuarios/Servicio/ServicioClienteEmpresa";
import { ClienteEmpresa } from "../../src/ModuloUsuarios/Dominio/ClienteEmpresa";

class RepositorioClienteEmpresaFalso {
  private data: ClienteEmpresa[] = [];
  private next = 1;

  crearClienteEmpresa(cedula: string, nombre: string) {
    const id = `${this.next++}`;
    const cliente = new ClienteEmpresa(id, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClienteEmpresas() {
    return this.data;
  }

  obtenerClienteEmpresaPorId(id: string) {
    return this.data.find((c) => c.getId() === id);
  }

  actualizarClienteEmpresa(id: string, cedula: string, nombre: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new ClienteEmpresa(id, cedula, nombre);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarClienteEmpresa(id: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((c) => c.getId() === id);
  }
}

function crearClienteEmpresaPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);

  const cliente = servicio.crearClienteEmpresa("999", "EmpresaX");
  assert.strictEqual(cliente.getCedula(), "999");
}

function obtenerClienteEmpresaPorIdPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);
  const cliente = repositorio.crearClienteEmpresa("888", "EmpresaY");

  const encontrado = servicio.obtenerClienteEmpresaPorId(cliente.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    servicio.obtenerClienteEmpresaPorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

function actualizarClienteEmpresaPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);
  const cliente = repositorio.crearClienteEmpresa("111", "Old");

  const actualizado = servicio.actualizarClienteEmpresa(cliente.getId(), "222", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.getCedula(), "222");
}

function eliminarClienteEmpresaPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);
  const cliente = repositorio.crearClienteEmpresa("55", "X");

  servicio.eliminarClienteEmpresa(cliente.getId());
  assert.strictEqual(repositorio.existe(cliente.getId()), false);
}

const pruebas = [
  ["Crear cliente empresa", crearClienteEmpresaPrueba],
  ["Obtener cliente empresa por id", obtenerClienteEmpresaPorIdPrueba],
  ["Actualizar cliente empresa", actualizarClienteEmpresaPrueba],
  ["Eliminar cliente empresa", eliminarClienteEmpresaPrueba],
] as const;

function ejecutarPruebas() {
  for (const [nombre, prueba] of pruebas) {
    try {
      prueba();
      console.log(`✅ ${nombre}`);
    } catch (error) {
      console.error(`❌ ${nombre}`);
      console.error(error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  ejecutarPruebas();
}
