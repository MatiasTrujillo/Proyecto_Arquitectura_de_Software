import assert from "assert";
import { ServicioProducto } from "../../src/ModuloCatalogo/Servicio/ServicioProducto";
import { Producto } from "../../src/ModuloCatalogo/Dominio/Producto";

class RepositorioProductoFalso {
  private data: Producto[] = [];
  private next = 1;

  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string) {
    const producto = new Producto(this.next++, descripcion, valor, tamano, categoria);
    this.data.push(producto);
    return producto;
  }

  obtenerProductos() {
    return this.data;
  }

  obtenerProductoPorId(id: number) {
    return this.data.find((p) => p.getId() === id);
  }

  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string) {
    const idx = this.data.findIndex((p) => p.getId() === id);
    if (idx === -1) return undefined;
    const updated = new Producto(id, descripcion, valor, tamano, categoria);
    this.data[idx] = updated;
    return updated;
  }

  eliminarProducto(id: number) {
    const idx = this.data.findIndex((p) => p.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: number) {
    return this.data.some((p) => p.getId() === id);
  }
}

async function crearProductoPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);

  const producto = await servicio.crearProducto("Prod A", 100, 10, "Cat1");
  assert.strictEqual(producto.id, 1);
  assert.strictEqual(producto.descripcion, "Prod A");
}

async function obtenerProductoPorIdPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  const producto = repositorio.crearProducto("Prod B", 50, 5, "Cat2");

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
  repositorio.crearProducto("P1", 10, 1, "C");
  repositorio.crearProducto("P2", 20, 2, "C");

  const productos = await servicio.obtenerProductos();
  assert.strictEqual(productos.length, 2);
}

function existePrueba() {
  const repositorio = new RepositorioProductoFalso();
  const producto = repositorio.crearProducto("P3", 30, 3, "C");

  assert.strictEqual(repositorio.existe(producto.getId()), true);
  assert.strictEqual(repositorio.existe(12345), false);
}

async function actualizarProductoPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  const producto = repositorio.crearProducto("Old", 5, 1, "C1");

  const actualizado = await servicio.actualizarProducto(producto.getId(), "New", 99, 9, "C2");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.descripcion, "New");
}

async function eliminarProductoPrueba() {
  const repositorio = new RepositorioProductoFalso();
  const servicio = new ServicioProducto(repositorio as any);
  const producto = repositorio.crearProducto("ToDelete", 1, 1, "C");

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
