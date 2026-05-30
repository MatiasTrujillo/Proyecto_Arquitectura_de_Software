import assert from "assert";
import { ControladorConductor } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorConductor";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioConductorFalso {
  private data: any[] = [];

  crearConductor(cedula: string, nombre: string) {
    const conductor = {
      getId: () => "1",
      getCedula: () => cedula,
      getNombre: () => nombre,
      obtenerRol: () => "Conductor",
    };
    this.data.push(conductor);
    return conductor;
  }

  obtenerConductores() {
    return this.data;
  }

  obtenerConductorPorId(id: string) {
    const conductor = this.data.find((item) => item.getId() === id);
    if (!conductor) throw new Error("Conductor no encontrado");
    return conductor;
  }

  actualizarConductor(id: string, cedula: string, nombre: string) {
    const index = this.data.findIndex((item) => item.getId() === id);
    if (index === -1) throw new Error("Conductor no encontrado");
    const actualizado = {
      getId: () => id,
      getCedula: () => cedula,
      getNombre: () => nombre,
      obtenerRol: () => "Conductor",
    };
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarConductor(id: string) {
    const index = this.data.findIndex((item) => item.getId() === id);
    if (index === -1) throw new Error("Conductor no encontrado");
    this.data.splice(index, 1);
  }
}

function crearConductorPrueba() {
  const controlador = new ControladorConductor(new ServicioConductorFalso() as any);
  const req = crearRequestMock({}, { cedula: "888", nombre: "Sofía" });
  const res = crearResponseMock();

  controlador.crearConductor(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.nombre, "Sofía");
}

function obtenerConductoresPrueba() {
  const servicio = new ServicioConductorFalso();
  servicio.crearConductor("999", "Diego");
  const controlador = new ControladorConductor(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerConductor(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data[0].cedula, "999");
}

function obtenerConductorPorIdPrueba() {
  const servicio = new ServicioConductorFalso();
  const conductor = servicio.crearConductor("101", "Iván");
  const controlador = new ControladorConductor(servicio as any);
  const req = crearRequestMock({ id: conductor.getId() }, {});
  const res = crearResponseMock();

  controlador.obtenerConductorPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "Iván");
}

function actualizarConductorPrueba() {
  const servicio = new ServicioConductorFalso();
  const conductor = servicio.crearConductor("202", "Old");
  const controlador = new ControladorConductor(servicio as any);
  const req = crearRequestMock({ id: conductor.getId() }, { cedula: "202", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarConductor(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarConductorPrueba() {
  const servicio = new ServicioConductorFalso();
  const conductor = servicio.crearConductor("303", "X");
  const controlador = new ControladorConductor(servicio as any);
  const req = crearRequestMock({ id: conductor.getId() }, {});
  const res = crearResponseMock();

  controlador.eliminarConductor(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear conductor", crearConductorPrueba],
  ["Obtener conductores", obtenerConductoresPrueba],
  ["Obtener conductor por id", obtenerConductorPorIdPrueba],
  ["Actualizar conductor", actualizarConductorPrueba],
  ["Eliminar conductor", eliminarConductorPrueba],
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
