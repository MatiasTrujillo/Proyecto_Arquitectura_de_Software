import assert from "assert";
import { ControladorClientePersonal } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorClientePersonal";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioClientePersonalFalso {
  private data: any[] = [];

  crearClientePersonal(cedula: string, nombre: string) {
    const cliente = {
      getId: () => "1",
      getCedula: () => cedula,
      getNombre: () => nombre,
      obtenerRol: () => "ClientePersonal",
    };
    this.data.push(cliente);
    return cliente;
  }

  obtenerClientePersonales() {
    return this.data;
  }

  obtenerClientePersonalPorId(id: string) {
    const cliente = this.data.find((item) => item.getId() === id);
    if (!cliente) throw new Error("Cliente personal no encontrado");
    return cliente;
  }

  actualizarClientePersonal(id: string, cedula: string, nombre: string) {
    const index = this.data.findIndex((item) => item.getId() === id);
    if (index === -1) throw new Error("Cliente personal no encontrado");
    const actualizado = {
      getId: () => id,
      getCedula: () => cedula,
      getNombre: () => nombre,
      obtenerRol: () => "ClientePersonal",
    };
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarClientePersonal(id: string) {
    const index = this.data.findIndex((item) => item.getId() === id);
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
  const req = crearRequestMock({ id: cliente.getId() }, {});
  const res = crearResponseMock();

  controlador.obtenerClientePersonalPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.cedula, "555");
}

function actualizarClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("666", "Old");
  const controlador = new ControladorClientePersonal(servicio as any);
  const req = crearRequestMock({ id: cliente.getId() }, { cedula: "666", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("777", "X");
  const controlador = new ControladorClientePersonal(servicio as any);
  const req = crearRequestMock({ id: cliente.getId() }, {});
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
