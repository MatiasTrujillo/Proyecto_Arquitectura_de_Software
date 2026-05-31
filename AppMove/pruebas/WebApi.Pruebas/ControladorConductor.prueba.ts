import assert from "assert";
import { ControladorConductor } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorConductor";
import { ConductorDTO } from "../../src/ModuloUsuarios/DTOs/ConductorDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioConductorFalso {
  private data: ConductorDTO[] = [];
  private next = 1;

  crearConductor(cedula: string, nombre: string): ConductorDTO {
    const conductor = new ConductorDTO(`${this.next++}`, cedula, nombre);
    this.data.push(conductor);
    return conductor;
  }

  obtenerConductores(): ConductorDTO[] {
    return this.data;
  }

  obtenerConductorPorId(id: string): ConductorDTO {
    const conductor = this.data.find((item) => item.id === id);
    if (!conductor) throw new Error("Conductor no encontrado");
    return conductor;
  }

  actualizarConductor(id: string, cedula: string, nombre: string): ConductorDTO {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Conductor no encontrado");
    const actualizado = new ConductorDTO(id, cedula, nombre);
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarConductor(id: string): void {
    const index = this.data.findIndex((item) => item.id === id);
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
  const req = crearRequestMock({ id: conductor.id }, {});
  const res = crearResponseMock();

  controlador.obtenerConductorPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "Iván");
}

function actualizarConductorPrueba() {
  const servicio = new ServicioConductorFalso();
  const conductor = servicio.crearConductor("202", "Old");
  const controlador = new ControladorConductor(servicio as any);
  const req = crearRequestMock({ id: conductor.id }, { cedula: "202", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarConductor(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarConductorPrueba() {
  const servicio = new ServicioConductorFalso();
  const conductor = servicio.crearConductor("303", "X");
  const controlador = new ControladorConductor(servicio as any);
  const req = crearRequestMock({ id: conductor.id }, {});
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
