import assert from "assert";
import { ControladorVehiculo } from "../../src/ModuloVehiculos/WebApi/Controlador/ControladorVehiculo";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

function crearVehiculoPrueba() {
  const controlador = new ControladorVehiculo();
  const req = crearRequestMock({}, { matricula: "A1" });
  const res = crearResponseMock();

  controlador.crearVehiculo(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.mensaje, "Vehículo creado");
}

function obtenerVehiculosPrueba() {
  const controlador = new ControladorVehiculo();
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerVehiculos(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, []);
}

function obtenerVehiculoPorIdPrueba() {
  const controlador = new ControladorVehiculo();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.obtenerVehiculoPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, {});
}

function actualizarVehiculoPrueba() {
  const controlador = new ControladorVehiculo();
  const req = crearRequestMock({ id: "1" }, { matricula: "X" });
  const res = crearResponseMock();

  controlador.actualizarVehiculo(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.mensaje, "Vehículo actualizado");
}

function eliminarVehiculoPrueba() {
  const controlador = new ControladorVehiculo();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.eliminarVehiculo(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear vehículo", crearVehiculoPrueba],
  ["Obtener vehículos", obtenerVehiculosPrueba],
  ["Obtener vehículo por id", obtenerVehiculoPorIdPrueba],
  ["Actualizar vehículo", actualizarVehiculoPrueba],
  ["Eliminar vehículo", eliminarVehiculoPrueba],
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
