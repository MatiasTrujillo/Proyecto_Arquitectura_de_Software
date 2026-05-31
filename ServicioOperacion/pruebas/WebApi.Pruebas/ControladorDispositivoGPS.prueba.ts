import assert from "assert";
import { ControladorDispositivoGPS } from "../../src/ModuloVehiculos/WebApi/Controlador/ControladorDispositivoGPS";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

function crearDispositivoGPSPrueba() {
  const controlador = new ControladorDispositivoGPS();
  const req = crearRequestMock({}, { dispositivoId: "d1" });
  const res = crearResponseMock();

  controlador.crearDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.mensaje, "DispositivoGPS creado");
}

function obtenerDispositivoGPSPrueba() {
  const controlador = new ControladorDispositivoGPS();
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, []);
}

function obtenerDispositivoGPSPorIdPrueba() {
  const controlador = new ControladorDispositivoGPS();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.obtenerDispositivoGPSPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, {});
}

function actualizarDispositivoGPSPrueba() {
  const controlador = new ControladorDispositivoGPS();
  const req = crearRequestMock({ id: "1" }, { ubicacion: "x" });
  const res = crearResponseMock();

  controlador.actualizarDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.mensaje, "DispositivoGPS actualizado");
}

function eliminarDispositivoGPSPrueba() {
  const controlador = new ControladorDispositivoGPS();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.eliminarDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear dispositivo GPS", crearDispositivoGPSPrueba],
  ["Obtener dispositivos GPS", obtenerDispositivoGPSPrueba],
  ["Obtener dispositivo GPS por id", obtenerDispositivoGPSPorIdPrueba],
  ["Actualizar dispositivo GPS", actualizarDispositivoGPSPrueba],
  ["Eliminar dispositivo GPS", eliminarDispositivoGPSPrueba],
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
