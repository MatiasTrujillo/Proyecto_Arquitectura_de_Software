import assert from "assert";
import { ServicioVehiculo } from "../../src/ModuloVehiculos/Servicio/ServicioVehiculo";
import { Vehiculo } from "../../src/ModuloVehiculos/Domain/Vehiculo";

class RepositorioVehiculoFalso {
  private data: Vehiculo[] = [];
  private next = 1;

  async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string) {
    const v = new Vehiculo(this.next++, matricula, tipo, capacidad, dispositivoGps);
    this.data.push(v);
    return v;
  }

  async obtenerVehiculos() {
    return this.data;
  }

  async obtenerVehiculoPorId(id: number) {
    return this.data.find(d => d.getId() === id);
  }

  async actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string) {
    const idx = this.data.findIndex(d => d.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new Vehiculo(id, matricula, tipo, capacidad, dispositivoGps);
    this.data[idx] = actualizado;
    return actualizado;
  }

  async eliminarVehiculo(id: number) {
    const idx = this.data.findIndex(d => d.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  async existe(id: number) {
    return this.data.some(d => d.getId() === id);
  }
}

async function crearVehiculoPrueba() {
  const repositorio = new RepositorioVehiculoFalso();
  const servicio = new ServicioVehiculo(repositorio as any);

  const v = await servicio.crearVehiculo("AAA111", "Auto", 4, "d1");
  assert.strictEqual(v.id, 1);
}

async function obtenerVehiculoPorIdPrueba() {
  const repositorio = new RepositorioVehiculoFalso();
  const servicio = new ServicioVehiculo(repositorio as any);
  const v = await repositorio.crearVehiculo("B1", "Auto", 4, "d1");

  const encontrado = await servicio.obtenerVehiculoPorId(v.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    await servicio.obtenerVehiculoPorId(999);
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function actualizarVehiculoPrueba() {
  const repositorio = new RepositorioVehiculoFalso();
  const servicio = new ServicioVehiculo(repositorio as any);
  const v = await repositorio.crearVehiculo("OLD", "Auto", 2, "d1");

  const actualizado = await servicio.actualizarVehiculo(v.getId(), "NEW", "Camion", 500, "d2");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.id, v.getId());
}

async function eliminarVehiculoPrueba() {
  const repositorio = new RepositorioVehiculoFalso();
  const servicio = new ServicioVehiculo(repositorio as any);
  const v = await repositorio.crearVehiculo("DEL", "Auto", 2, "d1");

  await servicio.eliminarVehiculo(v.getId());
  assert.strictEqual(await repositorio.existe(v.getId()), false);
}

const pruebas = [
  ["Crear vehículo", crearVehiculoPrueba],
  ["Obtener vehículo por id", obtenerVehiculoPorIdPrueba],
  ["Actualizar vehículo", actualizarVehiculoPrueba],
  ["Eliminar vehículo", eliminarVehiculoPrueba],
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
  ejecutarPruebas();
}
