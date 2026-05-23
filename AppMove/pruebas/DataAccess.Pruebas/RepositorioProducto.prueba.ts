import assert from "assert";
import { RepositorioProducto } from "../../src/ModuloCatalogo/DataAccess/RepositorioProducto";

function crearProductoTest() {
  const repo = new RepositorioProducto();
  const producto = repo.crearProducto("Prod A", 100, 10, "Cat1");

  // Verificar que al crear un producto, se guardan todos sus campos correctamente
  assert.strictEqual(producto.getId(), 1);
  assert.strictEqual(producto.getDescripcion(), "Prod A");
  assert.strictEqual(producto.getValor(), 100);
  assert.strictEqual(producto.getTamano(), 10);
  assert.strictEqual(producto.getCategoria(), "Cat1");
}

function obtenerProductoPorIdTest() {
  const repo = new RepositorioProducto();
  const producto = repo.crearProducto("Prod B", 50, 5, "Cat2");

  const encontrado = repo.obtenerProductoPorId(producto.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado.getDescripcion(), "Prod B");
  // Caso en que la id no exista, debe retornar undefined
  assert.strictEqual(repo.obtenerProductoPorId(999), undefined);
}

function obtenerTodosLosProductosTest() {
  const repo = new RepositorioProducto();
  repo.crearProducto("P1", 10, 1, "C");
  repo.crearProducto("P2", 20, 2, "C");

  const productos = repo.obtenerProductos();
  assert.strictEqual(productos.length, 2);
  // Existe algun producto con descripcion P1 y otro con P2
  assert.ok(productos.some(p => p.getDescripcion() === "P1"));
  assert.ok(productos.some(p => p.getDescripcion() === "P2"));
}

function existeTest() {
  const repo = new RepositorioProducto();
  const producto = repo.crearProducto("P3", 30, 3, "C");

  assert.strictEqual(repo.existe(producto.getId()), true);
  assert.strictEqual(repo.existe(12345), false);
}

function actualizarProductoTest() {
  const repo = new RepositorioProducto();
  const producto = repo.crearProducto("Old", 5, 1, "C1");

  const actualizado = repo.actualizarProducto(producto.getId(), "New", 99, 9, "C2");
  // De correcto
  assert.ok(actualizado);
  // Se actualicen correctamente todos los atributos
  assert.strictEqual(actualizado?.getDescripcion(), "New");
  assert.strictEqual(actualizado?.getValor(), 99);
  assert.strictEqual(actualizado?.getTamano(), 9);
  assert.strictEqual(actualizado?.getCategoria(), "C2");
}

function actualizarProductoInexistenteTest() {
  const repo = new RepositorioProducto();

  const actualizado = repo.actualizarProducto(999, "New", 99, 9, "C2");
  assert.strictEqual(actualizado, undefined);
}

function eliminarProductoTest() {
  const repo = new RepositorioProducto();
  const producto = repo.crearProducto("ToDelete", 1, 1, "C");

  assert.strictEqual(repo.eliminarProducto(producto.getId()), true);
  // Verificamos que el producto ya no exista
  assert.strictEqual(repo.existe(producto.getId()), false);
  assert.strictEqual(repo.obtenerProductos().length, 0);
}

const pruebas = [
  ["Crear producto", crearProductoTest],
  ["Obtener producto por id", obtenerProductoPorIdTest],
  ["Obtener todos los productos", obtenerTodosLosProductosTest],
  ["Existe", existeTest],
  ["Actualizar producto", actualizarProductoTest],
  ["Actualizar producto inexistente", actualizarProductoInexistenteTest],
  ["Eliminar producto", eliminarProductoTest],
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