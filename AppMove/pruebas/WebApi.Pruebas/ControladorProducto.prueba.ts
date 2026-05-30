import assert from "assert";
import { ControladorProducto } from "../../src/ModuloCatalogo/WebApi/Controlador/ControladorProducto";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

function crearProductoPrueba() {
  const controlador = new ControladorProducto();
  const req = crearRequestMock({}, { nombre: "Reloj" });
  const res = crearResponseMock();

  controlador.crearProducto(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.mensaje, "Producto creado");
}

function obtenerProductoPrueba() {
  const controlador = new ControladorProducto();
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerProducto(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, []);
}

function obtenerProductoPorIdPrueba() {
  const controlador = new ControladorProducto();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.obtenerProductoPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, {});
}

function actualizarProductoPrueba() {
  const controlador = new ControladorProducto();
  const req = crearRequestMock({ id: "1" }, { nombre: "Nuevo" });
  const res = crearResponseMock();

  controlador.actualizarProducto(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.mensaje, "Producto actualizado");
}

function eliminarProductoPrueba() {
  const controlador = new ControladorProducto();
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  controlador.eliminarProducto(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear producto", crearProductoPrueba],
  ["Obtener productos", obtenerProductoPrueba],
  ["Obtener producto por id", obtenerProductoPorIdPrueba],
  ["Actualizar producto", actualizarProductoPrueba],
  ["Eliminar producto", eliminarProductoPrueba],
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
