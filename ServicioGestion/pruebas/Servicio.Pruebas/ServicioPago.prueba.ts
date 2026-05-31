import assert from "assert";
import { ServicioPago } from "../../src/ModuloPagos/Servicio/ServicioPago";
import { Pago } from "../../src/ModuloPagos/Domain/Pago";

class RepositorioPagoFalso {
  private data: Pago[] = [];
  private next = 1;

  crearPago(fecha: Date, monto: number, estado: any) {
    const p = new Pago(this.next++, fecha, monto, estado);
    this.data.push(p);
    return p;
  }

  obtenerPagos() {
    return this.data;
  }

  obtenerPagoPorId(id: number) {
    return this.data.find((p) => p.getId() === id);
  }

  actualizarPago(id: number, fecha: Date, monto: number, estado: any) {
    const idx = this.data.findIndex((p) => p.getId() === id);
    if (idx === -1) return undefined;
    const updated = new Pago(id, fecha, monto, estado);
    this.data[idx] = updated;
    return updated;
  }

  eliminarPago(id: number) {
    const idx = this.data.findIndex((p) => p.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: number) {
    return this.data.some((p) => p.getId() === id);
  }
}

async function crearPagoPrueba() {
  const repositorio = new RepositorioPagoFalso();
  const servicio = new ServicioPago(repositorio as any);

  const pago = await servicio.crearPago("2024-01-01", 100, "aceptado");
  assert.strictEqual(pago.id, 1);
  assert.strictEqual(pago.monto, 100);
}

async function obtenerPagoPorIdPrueba() {
  const repositorio = new RepositorioPagoFalso();
  const servicio = new ServicioPago(repositorio as any);
  const pago = repositorio.crearPago(new Date(), 10, "pendiente");

  const encontrado = await servicio.obtenerPagoPorId(pago.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    await servicio.obtenerPagoPorId(999);
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function obtenerTodosLosPagosPrueba() {
  const repositorio = new RepositorioPagoFalso();
  const servicio = new ServicioPago(repositorio as any);
  repositorio.crearPago(new Date(), 1, "aceptado");
  repositorio.crearPago(new Date(), 2, "pendiente");

  const pagos = await servicio.obtenerPagos();
  assert.strictEqual(pagos.length, 2);
}

function existePrueba() {
  const repositorio = new RepositorioPagoFalso();
  const pago = repositorio.crearPago(new Date(), 5, "aceptado");

  assert.strictEqual(repositorio.existe(pago.getId()), true);
  assert.strictEqual(repositorio.existe(12345), false);
}

async function actualizarPagoPrueba() {
  const repositorio = new RepositorioPagoFalso();
  const servicio = new ServicioPago(repositorio as any);
  const pago = repositorio.crearPago(new Date(), 5, "aceptado");

  const actualizado = await servicio.actualizarPago(pago.getId(), new Date(), 99, "aceptado");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.monto, 99);
}

async function eliminarPagoPrueba() {
  const repositorio = new RepositorioPagoFalso();
  const servicio = new ServicioPago(repositorio as any);
  const pago = repositorio.crearPago(new Date(), 1, "aceptado");

  await servicio.eliminarPago(pago.getId());
  assert.strictEqual(repositorio.existe(pago.getId()), false);
}

const pruebas = [
  ["Crear pago", crearPagoPrueba],
  ["Obtener pago por id", obtenerPagoPorIdPrueba],
  ["Obtener todos los pagos", obtenerTodosLosPagosPrueba],
  ["Existe pago", existePrueba],
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
  void ejecutarPruebas();
}
