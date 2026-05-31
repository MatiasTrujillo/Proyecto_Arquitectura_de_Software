import assert from "assert";
import { ControladorPago } from "../../src/ModuloPagos/WebApi/Controlador/ControladorPago";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioPagoFalso {
  crearPago(fecha: string, monto: number, estado: string) {
    return {
      id: 1,
      fecha,
      monto,
      estado,
    };
  }

  obtenerPagos() {
    return [this.crearPago("2026-01-01", 100, "PENDIENTE")];
  }

  obtenerPagoPorId(id: number) {
    if (id !== 1) throw new Error("Pago no encontrado");
    return this.crearPago("2026-01-01", 100, "PENDIENTE");
  }

  actualizarPago(id: number, fecha: string, monto: number, estado: string) {
    if (id !== 1) throw new Error("Pago no encontrado");
    return this.crearPago(fecha, monto, estado);
  }

  eliminarPago(id: number) {
    if (id !== 1) throw new Error("Pago no encontrado");
  }
}

async function crearPagoPrueba() {
  const controlador = new ControladorPago(new ServicioPagoFalso() as any);
  const req = crearRequestMock({}, { fecha: "2026-01-01", monto: 250, estado: "COMPLETADO" });
  const res = crearResponseMock();

  await controlador.crearPago(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.deepStrictEqual(res.body.data, {
    id: 1,
    fecha: "2026-01-01",
    monto: 250,
    estado: "COMPLETADO",
  });
}

async function obtenerPagosPrueba() {
  const controlador = new ControladorPago(new ServicioPagoFalso() as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  await controlador.obtenerPago(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.length, 1);
}

async function obtenerPagoPorIdPrueba() {
  const controlador = new ControladorPago(new ServicioPagoFalso() as any);
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  await controlador.obtenerPagoPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.monto, 100);
}

async function actualizarPagoPrueba() {
  const controlador = new ControladorPago(new ServicioPagoFalso() as any);
  const req = crearRequestMock({ id: "1" }, { fecha: "2026-02-02", monto: 500, estado: "APROBADO" });
  const res = crearResponseMock();

  await controlador.actualizarPago(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.estado, "APROBADO");
}

async function eliminarPagoPrueba() {
  const controlador = new ControladorPago(new ServicioPagoFalso() as any);
  const req = crearRequestMock({ id: "1" }, {});
  const res = crearResponseMock();

  await controlador.eliminarPago(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear pago", crearPagoPrueba],
  ["Obtener pagos", obtenerPagosPrueba],
  ["Obtener pago por id", obtenerPagoPorIdPrueba],
  ["Actualizar pago", actualizarPagoPrueba],
  ["Eliminar pago", eliminarPagoPrueba],
] as const;

async function ejecutarPruebas() {
  for (const [nombre, prueba] of pruebas) {
    try {
      await prueba();
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
