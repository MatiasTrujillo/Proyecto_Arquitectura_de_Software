import assert from "assert";
import { ControladorViaje } from "../../src/ModuloReservas/WebApi/Controlador/ControladorViaje";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

function crearViajePrueba() {
  const controlador = new ControladorViaje();
  const req = crearRequestMock({}, { origen: "A", destino: "B" });
  const res = crearResponseMock();

  controlador.crearViaje(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.mensaje, "Viaje creado");
}

function obtenerViajePrueba() {
  const controlador = new ControladorViaje();
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerViaje(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, []);
}

function obtenerViajePorIdPrueba() {
  const controlador = new ControladorViaje();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.obtenerViajePorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, {});
}

function actualizarViajePrueba() {
  const controlador = new ControladorViaje();
  const req = crearRequestMock({ id: "1" }, { origen: "A", destino: "C" });
  const res = crearResponseMock();

  controlador.actualizarViaje(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.mensaje, "Viaje actualizado");
}

function eliminarViajePrueba() {
  const controlador = new ControladorViaje();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.eliminarViaje(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear viaje", crearViajePrueba],
  ["Obtener viajes", obtenerViajePrueba],
  ["Obtener viaje por id", obtenerViajePorIdPrueba],
  ["Actualizar viaje", actualizarViajePrueba],
  ["Eliminar viaje", eliminarViajePrueba],
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
