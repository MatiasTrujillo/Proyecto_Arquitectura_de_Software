import assert from "assert";
import { RepositorioViaje } from "../../src/ModuloReservas/DataAccess/RepositorioViaje";

function crearViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = repo.crearViaje("R1", "Origen", "Destino", new Date("2026-01-01"), "Programado", "C1");

  assert.strictEqual(viaje.getId(), "1");
  assert.strictEqual(viaje.getReservaId(), "R1");
  assert.strictEqual(viaje.getOrigen(), "Origen");
  assert.strictEqual(viaje.getDestino(), "Destino");
  assert.strictEqual(viaje.getFecha().toISOString(), new Date("2026-01-01").toISOString());
  assert.strictEqual(viaje.getEstado(), "Programado");
  assert.strictEqual(viaje.getConductor(), "C1");
}

function obtenerViajePorIdTest() {
  const repo = new RepositorioViaje();
  const viaje = repo.crearViaje("R2", "O", "D", new Date("2026-02-01"), "EnCurso", "C2");

  const encontrado = repo.obtenerViajePorId(viaje.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getOrigen(), "O");
  assert.strictEqual(repo.obtenerViajePorId("999"), undefined);
}

function obtenerTodosLosViajesTest() {
  const repo = new RepositorioViaje();
  repo.crearViaje("R3", "A", "B", new Date("2026-03-01"), "X", "C");
  repo.crearViaje("R4", "A2", "B2", new Date("2026-03-02"), "Y", "C");

  const viajes = repo.obtenerViajes();
  assert.strictEqual(viajes.length, 2);
  assert.ok(viajes.some(v => v.getOrigen() === "A"));
  assert.ok(viajes.some(v => v.getOrigen() === "A2"));
}

function existeViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = repo.crearViaje("R5", "X", "Y", new Date("2026-04-01"), "Z", "C");

  assert.strictEqual(repo.existe(viaje.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = repo.crearViaje("R6", "OldOrigin", "OldDest", new Date("2026-05-01"), "Old", "C");

  const actualizado = repo.actualizarViaje(viaje.getId(), "R6", "NewOrigin", "NewDest", new Date("2026-05-02"), "Nuevo", "Cnew");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getOrigen(), "NewOrigin");
  assert.strictEqual(actualizado?.getDestino(), "NewDest");
  assert.strictEqual(actualizado?.getEstado(), "Nuevo");
}

function eliminarViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = repo.crearViaje("R7", "ToDel", "ToDel", new Date("2026-07-01"), "S", "C");

  assert.strictEqual(repo.eliminarViaje(viaje.getId()), true);
  assert.strictEqual(repo.existe(viaje.getId()), false);
  assert.strictEqual(repo.obtenerViajes().length, 0);
}

const pruebas = [
  ["Crear viaje", crearViajeTest],
  ["Obtener viaje por id", obtenerViajePorIdTest],
  ["Obtener todos los viajes", obtenerTodosLosViajesTest],
  ["Existe", existeViajeTest],
  ["Actualizar viaje", actualizarViajeTest],
  ["Eliminar viaje", eliminarViajeTest],
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
