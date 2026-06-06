import assert from "assert";
import { ServicioDispositivoGPS } from "../../src/ModuloVehiculos/Servicio/ServicioDispositivoGPS";
import { DispositivoGPS } from "../../src/ModuloVehiculos/Domain/DispositivoGPS";

class RepositorioDispositivoGPSFalso {
  private data: DispositivoGPS[] = [];
  private next = 1;

  async crearDispositivoGPS(ubicacion: string) {
    const dispositivo = new DispositivoGPS(this.next++, ubicacion);
    this.data.push(dispositivo);
    return dispositivo;
  }

  async obtenerDispositivosGPS() {
    return this.data;
  }

  async obtenerDispositivoGPSPorId(id: number) {
    return this.data.find((d) => d.getId() === id);
  }

  async actualizarDispositivoGPS(id: number, ubicacion: string) {
    const idx = this.data.findIndex((d) => d.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new DispositivoGPS(id, ubicacion);
    this.data[idx] = actualizado;
    return actualizado;
  }

  async eliminarDispositivoGPS(id: number) {
    const idx = this.data.findIndex((d) => d.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  async existe(id: number) {
    return this.data.some((d) => d.getId() === id);
  }
}

async function crearDispositivoPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);

  const dispositivo = await servicio.crearDispositivoGPS("Ubicación A");
  assert.strictEqual(dispositivo.toEntity().getId(), 1);
}

async function obtenerDispositivoPorIdPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);
  const dispositivo = await repositorio.crearDispositivoGPS("Ubicación B");

  const encontrado = await servicio.obtenerDispositivoGPSPorId(dispositivo.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    await servicio.obtenerDispositivoGPSPorId(999);
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function actualizarDispositivoPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);
  const dispositivo = await repositorio.crearDispositivoGPS("Ubicación original");

  const actualizado = await servicio.actualizarDispositivoGPS(dispositivo.getId(), "Ubicación actualizada");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.toEntity().getId(), dispositivo.getId());
}

async function eliminarDispositivoPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);
  const dispositivo = await repositorio.crearDispositivoGPS("Ubicación a eliminar");

  await servicio.eliminarDispositivoGPS(dispositivo.getId());
  assert.strictEqual(await repositorio.existe(dispositivo.getId()), false);
}

const pruebas = [
  ["Crear dispositivo GPS", crearDispositivoPrueba],
  ["Obtener dispositivo por id", obtenerDispositivoPorIdPrueba],
  ["Actualizar dispositivo GPS", actualizarDispositivoPrueba],
  ["Eliminar dispositivo GPS", eliminarDispositivoPrueba],
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
  ejecutarPruebas().catch(error => {
    console.error("❌ Error en las pruebas:", error);
    process.exit(1);
  });
}
