import assert from "assert";
import { RepositorioIncidente } from "../../src/ModuloReservas/DataAccess/RepositorioIncidente";

function crearIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = repo.crearIncidente("Desc", new Date("2026-01-01"), "R1", "Abierto", "Alta");

  assert.strictEqual(incidente.getId(), "1");
  assert.strictEqual(incidente.getDescripcion(), "Desc");
  assert.strictEqual(incidente.getFecha().toISOString(), new Date("2026-01-01").toISOString());
  assert.strictEqual(incidente.getReservaId(), "R1");
  assert.strictEqual(incidente.getEstado(), "Abierto");
  assert.strictEqual(incidente.getSeveridad(), "Alta");
}

function obtenerIncidentePorIdTest() {
  const repo = new RepositorioIncidente();
  const incidente = repo.crearIncidente("X", new Date("2026-02-01"), "R2", "Cerrado", "Baja");

  const encontrado = repo.obtenerIncidentePorId(incidente.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getDescripcion(), "X");
  assert.strictEqual(repo.obtenerIncidentePorId("999"), undefined);
}

function obtenerTodosLosIncidentesTest() {
  const repo = new RepositorioIncidente();
  repo.crearIncidente("A", new Date("2026-03-01"), "R3", "Abierto", "Media");
  repo.crearIncidente("B", new Date("2026-03-02"), "R4", "Abierto", "Baja");

  const incidentes = repo.obtenerIncidentes();
  assert.strictEqual(incidentes.length, 2);
  assert.ok(incidentes.some(i => i.getDescripcion() === "A"));
  assert.ok(incidentes.some(i => i.getDescripcion() === "B"));
}

function existeIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = repo.crearIncidente("E", new Date("2026-04-01"), "R5", "Abierto", "Alta");

  assert.strictEqual(repo.existe(incidente.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = repo.crearIncidente("Old", new Date("2026-05-01"), "R6", "Abierto", "Baja");

  const actualizado = repo.actualizarIncidente(incidente.getId(), "New", new Date("2026-05-02"), "R6", "Cerrado", "Alta");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getDescripcion(), "New");
  assert.strictEqual(actualizado?.getEstado(), "Cerrado");
  assert.strictEqual(actualizado?.getSeveridad(), "Alta");
}

function eliminarIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = repo.crearIncidente("ToDel", new Date("2026-07-01"), "R7", "Abierto", "Media");

  assert.strictEqual(repo.eliminarIncidente(incidente.getId()), true);
  assert.strictEqual(repo.existe(incidente.getId()), false);
  assert.strictEqual(repo.obtenerIncidentes().length, 0);
}

const pruebas = [
  ["Crear incidente", crearIncidenteTest],
  ["Obtener incidente por id", obtenerIncidentePorIdTest],
  ["Obtener todos los incidentes", obtenerTodosLosIncidentesTest],
  ["Existe", existeIncidenteTest],
  ["Actualizar incidente", actualizarIncidenteTest],
  ["Eliminar incidente", eliminarIncidenteTest],
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
