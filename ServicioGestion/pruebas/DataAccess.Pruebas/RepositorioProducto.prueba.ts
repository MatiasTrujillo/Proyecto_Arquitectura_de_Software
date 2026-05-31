import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioProducto } from "../../src/ModuloCatalogo/DataAccess/RepositorioProducto";

async function limpiarBD() {
  await pool.query('DELETE FROM producto');
  await pool.query('ALTER SEQUENCE producto_id_seq RESTART WITH 1');
}

async function crearProductoTest() {
  const repo = new RepositorioProducto();
  const producto = await repo.crearProducto("Prod A", 100, 10, "Cat1");

  assert.strictEqual(producto.getId(), 1);
  assert.strictEqual(producto.getDescripcion(), "Prod A");
  assert.strictEqual(producto.getValor(), 100);
  assert.strictEqual(producto.getTamano(), 10);
  assert.strictEqual(producto.getCategoria(), "Cat1");
}

async function obtenerProductoPorIdTest() {
  const repo = new RepositorioProducto();
  const producto = await repo.crearProducto("Prod B", 50, 5, "Cat2");

  const encontrado = await repo.obtenerProductoPorId(producto.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getDescripcion(), "Prod B");
  assert.strictEqual(await repo.obtenerProductoPorId(999), undefined);
}

async function obtenerTodosLosProductosTest() {
  const repo = new RepositorioProducto();
  await repo.crearProducto("P1", 10, 1, "C");
  await repo.crearProducto("P2", 20, 2, "C");

  const productos = await repo.obtenerProductos();
  assert.strictEqual(productos.length, 2);
  assert.ok(productos.some(p => p.getDescripcion() === "P1"));
  assert.ok(productos.some(p => p.getDescripcion() === "P2"));
}

async function existeTest() {
  const repo = new RepositorioProducto();
  const producto = await repo.crearProducto("P3", 30, 3, "C");

  assert.strictEqual(await repo.existe(producto.getId()), true);
  assert.strictEqual(await repo.existe(12345), false);
}

async function actualizarProductoTest() {
  const repo = new RepositorioProducto();
  const producto = await repo.crearProducto("Old", 5, 1, "C1");

  const actualizado = await repo.actualizarProducto(producto.getId(), "New", 99, 9, "C2");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getDescripcion(), "New");
  assert.strictEqual(actualizado?.getValor(), 99);
  assert.strictEqual(actualizado?.getTamano(), 9);
  assert.strictEqual(actualizado?.getCategoria(), "C2");
}

async function eliminarProductoTest() {
  const repo = new RepositorioProducto();
  const producto = await repo.crearProducto("ToDelete", 1, 1, "C");

  assert.strictEqual(await repo.eliminarProducto(producto.getId()), true);
  assert.strictEqual(await repo.existe(producto.getId()), false);
  assert.strictEqual((await repo.obtenerProductos()).length, 0);
}

const pruebas = [
  ["Crear producto", crearProductoTest],
  ["Obtener producto por id", obtenerProductoPorIdTest],
  ["Obtener todos los productos", obtenerTodosLosProductosTest],
  ["Existe", existeTest],
  ["Actualizar producto", actualizarProductoTest],
  ["Eliminar producto", eliminarProductoTest],
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
