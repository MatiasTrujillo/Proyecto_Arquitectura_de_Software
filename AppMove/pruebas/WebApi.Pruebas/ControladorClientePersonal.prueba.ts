import assert from "assert";
import { ControladorClientePersonal } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorClientePersonal";
import { ClientePersonalDTO } from "../../src/ModuloUsuarios/DTOs/ClientePersonalDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioClientePersonalFalso {
  private data: ClientePersonalDTO[] = [];
  private next = 1;

  crearClientePersonal(cedula: string, nombre: string): ClientePersonalDTO {
    const cliente = new ClientePersonalDTO(`${this.next++}`, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClientePersonales(): ClientePersonalDTO[] {
    return this.data;
  }

  obtenerClientePersonalPorId(id: string): ClientePersonalDTO {
    const cliente = this.data.find((item) => item.id === id);
    if (!cliente) throw new Error("Cliente personal no encontrado");
    return cliente;
  }

  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonalDTO {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente personal no encontrado");
    const actualizado = new ClientePersonalDTO(id, cedula, nombre);
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarClientePersonal(id: string): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente personal no encontrado");
    this.data.splice(index, 1);
  }
}

function crearClientePersonalPrueba() {
  const controlador = new ControladorClientePersonal(new ServicioClientePersonalFalso() as any);
  const req = crearRequestMock({}, { cedula: "789", nombre: "Marta" });
  const res = crearResponseMock();

  controlador.crearClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.nombre, "Marta");
}

function obtenerClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  servicio.crearClientePersonal("444", "Luis");
  const controlador = new ControladorClientePersonal(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data[0].cedula, "444");
}

function obtenerClientePersonalPorIdPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("555", "Nora");
  const controlador = new ControladorClientePersonal(servicio as any);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  controlador.obtenerClientePersonalPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.cedula, "555");
}

function actualizarClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("666", "Old");
  const controlador = new ControladorClientePersonal(servicio as any);
  const req = crearRequestMock({ id: cliente.id }, { cedula: "666", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("777", "X");
  const controlador = new ControladorClientePersonal(servicio as any);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  controlador.eliminarClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear cliente personal", crearClientePersonalPrueba],
  ["Obtener clientes personales", obtenerClientePersonalPrueba],
  ["Obtener cliente personal por id", obtenerClientePersonalPorIdPrueba],
  ["Actualizar cliente personal", actualizarClientePersonalPrueba],
  ["Eliminar cliente personal", eliminarClientePersonalPrueba],
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
