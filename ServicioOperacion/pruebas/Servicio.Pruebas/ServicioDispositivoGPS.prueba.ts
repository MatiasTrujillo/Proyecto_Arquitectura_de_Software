import assert from "assert";
import { ServicioDispositivoGPS } from "../../src/ModuloVehiculos/Servicio/ServicioDispositivoGPS";
import { DispositivoGPS } from "../../src/ModuloVehiculos/Domain/DispositivoGPS";

class RepositorioDispositivoGPSFalso {
  private data: DispositivoGPS[] = [];
  private next = 1;

  crearDispositivoGPS() {
    const dispositivo = new DispositivoGPS(this.next++);
    this.data.push(dispositivo);
    return dispositivo;
  }

  obtenerDispositivosGPS() {
    return this.data;
  }

  obtenerDispositivoGPSPorId(id: number) {
    return this.data.find((d) => d.getId() === id);
  }

  actualizarDispositivoGPS(id: number) {
    const idx = this.data.findIndex((d) => d.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new DispositivoGPS(id);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarDispositivoGPS(id: number) {
    const idx = this.data.findIndex((d) => d.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: number) {
    return this.data.some((d) => d.getId() === id);
  }
}

function crearDispositivoPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);

  const dispositivo = servicio.crearDispositivoGPS();
  assert.strictEqual(dispositivo.getId(), 1);
}

function obtenerDispositivoPorIdPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);
  const dispositivo = repositorio.crearDispositivoGPS();

  const encontrado = servicio.obtenerDispositivoGPSPorId(dispositivo.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    servicio.obtenerDispositivoGPSPorId(999);
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

function actualizarDispositivoPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);
  const dispositivo = repositorio.crearDispositivoGPS();

  const actualizado = servicio.actualizarDispositivoGPS(dispositivo.getId());
  assert.ok(actualizado);
  assert.strictEqual(actualizado.getId(), dispositivo.getId());
}

function eliminarDispositivoPrueba() {
  const repositorio = new RepositorioDispositivoGPSFalso();
  const servicio = new ServicioDispositivoGPS(repositorio as any);
  const dispositivo = repositorio.crearDispositivoGPS();

  servicio.eliminarDispositivoGPS(dispositivo.getId());
  assert.strictEqual(repositorio.existe(dispositivo.getId()), false);
}

const pruebas = [
  ["Crear dispositivo GPS", crearDispositivoPrueba],
  ["Obtener dispositivo por id", obtenerDispositivoPorIdPrueba],
  ["Actualizar dispositivo GPS", actualizarDispositivoPrueba],
  ["Eliminar dispositivo GPS", eliminarDispositivoPrueba],
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
