import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioPago } from "../../src/ModuloPagos/DataAccess/RepositorioPago";
import { EstadoPago } from "../../src/ModuloPagos/Domain/EstadoPago";

async function limpiarBD() {
  await pool.query('DELETE FROM pago');
  await pool.query('ALTER SEQUENCE pago_id_seq RESTART WITH 1');
}

async function crearPagoTest() {
  const repo = new RepositorioPago();
  const pago = await repo.crearPago(new Date("2026-01-01"), 100, EstadoPago.Pendiente, "R1");

  assert.strictEqual(pago.getId(), 1);
  assert.strictEqual(pago.getMonto(), 100);
  assert.strictEqual(pago.getFecha().toISOString(), new Date("2026-01-01").toISOString());
  assert.strictEqual(pago.getEstado(), EstadoPago.Pendiente);
}

async function obtenerPagoPorIdTest() {
  const repo = new RepositorioPago();
  const pago = await repo.crearPago(new Date("2026-02-01"), 150, EstadoPago.Aceptado, "R1");

  const encontrado = await repo.obtenerPagoPorId(pago.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getMonto(), 150);
  assert.strictEqual(encontrado?.getEstado(), EstadoPago.Aceptado);
  assert.strictEqual(await repo.obtenerPagoPorId(999), undefined);
}

async function obtenerTodosLosPagosTest() {
  const repo = new RepositorioPago();
  await repo.crearPago(new Date("2026-03-01"), 200, EstadoPago.Pendiente, "R1");
  await repo.crearPago(new Date("2026-03-02"), 300, EstadoPago.Rechazado, "R1");

  const pagos = await repo.obtenerPagos();
  assert.strictEqual(pagos.length, 2);
  assert.ok(pagos.some(p => p.getMonto() === 200));
  assert.ok(pagos.some(p => p.getMonto() === 300));
}

async function existePagoTest() {
  const repo = new RepositorioPago();
  const pago = await repo.crearPago(new Date("2026-04-01"), 400, EstadoPago.Pendiente, "R1");

  assert.strictEqual(await repo.existe(pago.getId()), true);
  assert.strictEqual(await repo.existe(999), false);
}

async function actualizarPagoTest() {
  const repo = new RepositorioPago();
  const pago = await repo.crearPago(new Date("2026-05-01"), 500, EstadoPago.Pendiente, "R1");

  const actualizado = await repo.actualizarPago(pago.getId(), new Date("2026-05-02"), 550, EstadoPago.Aceptado, "R1");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getMonto(), 550);
  assert.strictEqual(actualizado?.getEstado(), EstadoPago.Aceptado);
  assert.strictEqual(actualizado?.getFecha().toISOString(), new Date("2026-05-02").toISOString());
}

async function eliminarPagoTest() {
  const repo = new RepositorioPago();
  const pago = await repo.crearPago(new Date("2026-07-01"), 700, EstadoPago.Pendiente, "R1");

  assert.strictEqual(await repo.eliminarPago(pago.getId()), true);
  assert.strictEqual(await repo.existe(pago.getId()), false);
  assert.strictEqual((await repo.obtenerPagos()).length, 0);
}

const pruebas = [
  ["Crear pago", crearPagoTest],
  ["Obtener pago por id", obtenerPagoPorIdTest],
  ["Obtener todos los pagos", obtenerTodosLosPagosTest],
  ["Existe", existePagoTest],
  ["Actualizar pago", actualizarPagoTest],
  ["Eliminar pago", eliminarPagoTest],
] as const;

async function ejecutarPruebas() {
  try {
    for (const [nombre, prueba] of pruebas) {
      try {
        await limpiarBD();
        await prueba();
        console.log(`✅ ${nombre}`);
      } catch (error) {
        console.error(`❌ ${nombre}`);
        console.error(error);
        process.exit(1);
      }
    }
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  ejecutarPruebas();
}
