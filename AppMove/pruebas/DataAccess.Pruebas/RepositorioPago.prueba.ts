import assert from "assert";
import { RepositorioPago } from "../../src/ModuloPagos/DataAccess/RepositorioPago";
import { EstadoPago } from "../../src/ModuloPagos/Domain/EstadoPago";

function crearPagoTest() {
  const repo = new RepositorioPago();
  const pago = repo.crearPago(new Date("2026-01-01"), 100, EstadoPago.Pendiente);

  // Verificar que al crear un pago, se guardan todos sus campos correctamente
  assert.strictEqual(pago.getId(), 1);
  assert.strictEqual(pago.getMonto(), 100);
  assert.strictEqual(pago.getFecha().toISOString(), new Date("2026-01-01").toISOString());
  assert.strictEqual(pago.getEstado(), EstadoPago.Pendiente);
}

function obtenerPagoPorIdTest() {
  const repo = new RepositorioPago();
  const pago = repo.crearPago(new Date("2026-02-01"), 150, EstadoPago.Aceptado);

  const encontrado = repo.obtenerPagoPorId(pago.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getMonto(), 150);
  assert.strictEqual(encontrado?.getEstado(), EstadoPago.Aceptado);
  // Caso en que la id no exista, debe retornar undefined
  assert.strictEqual(repo.obtenerPagoPorId(999), undefined);
}

function obtenerTodosLosPagosTest() {
  const repo = new RepositorioPago();
  repo.crearPago(new Date("2026-03-01"), 200, EstadoPago.Pendiente);
  repo.crearPago(new Date("2026-03-02"), 300, EstadoPago.Rechazado);

  const pagos = repo.obtenerPagos();
  assert.strictEqual(pagos.length, 2);
  // Existe algún pago con monto 200 y otro con monto 300
  assert.ok(pagos.some(p => p.getMonto() === 200));
  assert.ok(pagos.some(p => p.getMonto() === 300));
}

function existePagoTest() {
  const repo = new RepositorioPago();
  const pago = repo.crearPago(new Date("2026-04-01"), 400, EstadoPago.Pendiente);

  assert.strictEqual(repo.existe(pago.getId()), true);
  assert.strictEqual(repo.existe(999), false);
}

function actualizarPagoTest() {
  const repo = new RepositorioPago();
  const pago = repo.crearPago(new Date("2026-05-01"), 500, EstadoPago.Pendiente);

  const actualizado = repo.actualizarPago(pago.getId(), new Date("2026-05-02"), 550, EstadoPago.Aceptado);
  // De correcto
  assert.ok(actualizado);
  // Se actualicen correctamente todos los atributos
  assert.strictEqual(actualizado?.getMonto(), 550);
  assert.strictEqual(actualizado?.getEstado(), EstadoPago.Aceptado);
  assert.strictEqual(actualizado?.getFecha().toISOString(), new Date("2026-05-02").toISOString());
}

function eliminarPagoTest() {
  const repo = new RepositorioPago();
  const pago = repo.crearPago(new Date("2026-07-01"), 700, EstadoPago.Pendiente);

  assert.strictEqual(repo.eliminarPago(pago.getId()), true);
  // Verificamos que el pago ya no exista
  assert.strictEqual(repo.existe(pago.getId()), false);
  assert.strictEqual(repo.obtenerPagos().length, 0);
}

const pruebas = [
  ["Crear pago", crearPagoTest],
  ["Obtener pago por id", obtenerPagoPorIdTest],
  ["Obtener todos los pagos", obtenerTodosLosPagosTest],
  ["Existe", existePagoTest],
  ["Actualizar pago", actualizarPagoTest],
  ["Eliminar pago", eliminarPagoTest],
] as const;

function ejecutarPruebas() {
  for (const [nombre, prueba] of pruebas) {
    try {
      prueba();
      console.log(`✅ ${nombre}`);
    } catch (error) { // Si alguna prueba falla, se muestra el error y se detiene la ejecución
      console.error(`❌ ${nombre}`);
      console.error(error);
      process.exit(1);
    }
  }
}


if (require.main === module) {
  ejecutarPruebas();
}