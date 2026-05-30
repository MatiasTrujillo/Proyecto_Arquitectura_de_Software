import assert from "assert";
import { ControladorIncidente } from "../../src/ModuloReservas/WebApi/Controlador/ControladorIncidente";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

function crearIncidentePrueba() {
  const controlador = new ControladorIncidente();
  const req = crearRequestMock({}, { descripcion: "Accidente" });
  const res = crearResponseMock();

  controlador.crearIncidente(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.mensaje, "Incidente creado");
}

function obtenerIncidentePrueba() {
  const controlador = new ControladorIncidente();
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerIncidente(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, []);
}

function obtenerIncidentePorIdPrueba() {
  const controlador = new ControladorIncidente();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.obtenerIncidentePorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, {});
}

function actualizarIncidentePrueba() {
  const controlador = new ControladorIncidente();
  const req = crearRequestMock({ id: "1" }, { descripcion: "Actualizado" });
  const res = crearResponseMock();

  controlador.actualizarIncidente(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.mensaje, "Incidente actualizado");
}

function eliminarIncidentePrueba() {
  const controlador = new ControladorIncidente();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.eliminarIncidente(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear incidente", crearIncidentePrueba],
  ["Obtener incidentes", obtenerIncidentePrueba],
  ["Obtener incidente por id", obtenerIncidentePorIdPrueba],
  ["Actualizar incidente", actualizarIncidentePrueba],
  ["Eliminar incidente", eliminarIncidentePrueba],
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
