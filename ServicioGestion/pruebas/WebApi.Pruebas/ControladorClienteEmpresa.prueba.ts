import assert from "assert";
import { ControladorClienteEmpresa } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorClienteEmpresa";
import { ClienteEmpresaDTO } from "../../src/ModuloUsuarios/DTOs/ClienteEmpresaDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioClienteEmpresaFalso {
  private data: ClienteEmpresaDTO[] = [];
  private next = 1;

  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresaDTO {
    const cliente = new ClienteEmpresaDTO(`${this.next++}`, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClienteEmpresas(): ClienteEmpresaDTO[] {
    return this.data;
  }

  obtenerClienteEmpresaPorId(id: string): ClienteEmpresaDTO {
    const cliente = this.data.find((item) => item.id === id);
    if (!cliente) throw new Error("Cliente empresa no encontrado");
    return cliente;
  }

  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresaDTO {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente empresa no encontrado");
    const actualizado = new ClienteEmpresaDTO(id, cedula, nombre);
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarClienteEmpresa(id: string): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente empresa no encontrado");
    this.data.splice(index, 1);
  }
}

function crearClienteEmpresaPrueba() {
  const controlador = new ControladorClienteEmpresa(new ServicioClienteEmpresaFalso() as any);
  const req = crearRequestMock({}, { cedula: "123", nombre: "Empresa S.A." });
  const res = crearResponseMock();

  controlador.crearClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.nombre, "Empresa S.A.");
}

function obtenerClienteEmpresaPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  servicio.crearClienteEmpresa("111", "Empresa X");
  const controlador = new ControladorClienteEmpresa(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data[0].cedula, "111");
}

function obtenerClienteEmpresaPorIdPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  const cliente = servicio.crearClienteEmpresa("222", "Empresa Y");
  const controlador = new ControladorClienteEmpresa(servicio as any);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  controlador.obtenerClienteEmpresaPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.cedula, "222");
}

function actualizarClienteEmpresaPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  const cliente = servicio.crearClienteEmpresa("333", "Old");
  const controlador = new ControladorClienteEmpresa(servicio as any);
  const req = crearRequestMock({ id: cliente.id }, { cedula: "333", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarClienteEmpresaPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  const cliente = servicio.crearClienteEmpresa("444", "X");
  const controlador = new ControladorClienteEmpresa(servicio as any);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  controlador.eliminarClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear cliente empresa", crearClienteEmpresaPrueba],
  ["Obtener clientes empresa", obtenerClienteEmpresaPrueba],
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
