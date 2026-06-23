import assert from "assert";
import { ServicioProducto } from "../../src/ModuloCatalogo/Servicio/ServicioProducto";
import { Producto } from "../../src/ModuloCatalogo/Dominio/Producto";

class RepositorioProductoFalso {
  private data: Producto[] = [];
  private next = 1;

  crearProducto(nombre: string) {
    const producto = new Producto(this.next++, nombre);
    this.data.push(producto);
    return producto;
  }

  obtenerProductos() { return this.data; }

  obtenerProductoPorId(id: number) {
    return this.data.find((p) => p.getId() === id);
  }

  actualizarProducto(id: number, nombre: string) {
    const idx = this.data.findIndex((p) => p.getId() === id);
    if (idx === -1) return undefined;
    const updated = new Producto(id, nombre);
    this.data[idx] = updated;
    return updated;
  }

  eliminarProducto(id: number) {
    const idx = this.data.findIndex((p) => p.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: number) { return this.data.some((p) => p.getId() === id); }
}

async function crearProductoPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);

  const producto = await servicio.crearProducto("Monitor");
  assert.strictEqual(producto.id, 1);
  assert.strictEqual(producto.nombre, "Monitor");
}

async function obtenerProductoPorIdPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  const producto = repositorio.crearProducto("Silla");

  const encontrado = await servicio.obtenerProductoPorId(producto.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    await servicio.obtenerProductoPorId(999);
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function obtenerTodosLosProductosPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  repositorio.crearProducto("P1");
  repositorio.crearProducto("P2");

  const productos = await servicio.obtenerProductos();
  assert.strictEqual(productos.length, 2);
}

function existePrueba() {
  const repositorio = new RepositorioProductoFalso();
  const producto = repositorio.crearProducto("P3");

  assert.strictEqual(repositorio.existe(producto.getId()), true);
  assert.strictEqual(repositorio.existe(12345), false);
}

async function actualizarProductoPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  const producto = repositorio.crearProducto("Old");

  const actualizado = await servicio.actualizarProducto(producto.getId(), "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.nombre, "New");
}

async function eliminarProductoPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  const producto = repositorio.crearProducto("ToDelete");

  await servicio.eliminarProducto(producto.getId());
  assert.strictEqual(repositorio.existe(producto.getId()), false);
}

const pruebas = [
  ["Crear producto", crearProductoPrueba],
  ["Obtener producto por id", obtenerProductoPorIdPrueba],
  ["Obtener todos los productos", obtenerTodosLosProductosPrueba],
  ["Existe producto", existePrueba],
  ["Actualizar producto", actualizarProductoPrueba],
  ["Eliminar producto", eliminarProductoPrueba],
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
