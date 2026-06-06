import assert from "assert";
import { ControladorVehiculo } from "../../src/ModuloVehiculos/WebApi/Controlador/ControladorVehiculo";
import { VehiculoDTO } from "../../src/ModuloVehiculos/DTOs/VehiculoDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioVehiculoFalso {
  private data: VehiculoDTO[] = [];
  private id = 1;

  async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<VehiculoDTO> {
    const vehiculo = new VehiculoDTO(this.id++, matricula, tipo, capacidad, dispositivoGps);
    this.data.push(vehiculo);
    return vehiculo;
  }

  async obtenerVehiculos(): Promise<VehiculoDTO[]> {
    return this.data;
  }

  async obtenerVehiculoPorId(id: number): Promise<VehiculoDTO> {
    const encontrado = this.data.find((v) => v.id === id);
    if (!encontrado) throw new Error("Vehículo no encontrado");
    return encontrado;
  }

  async actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<VehiculoDTO> {
    const index = this.data.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Vehículo no encontrado");
    const actualizado = new VehiculoDTO(id, matricula, tipo, capacidad, dispositivoGps);
    this.data[index] = actualizado;
    return actualizado;
  }

  async eliminarVehiculo(id: number): Promise<void> {
    const index = this.data.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Vehículo no encontrado");
    this.data.splice(index, 1);
  }
}

async function crearVehiculoPrueba() {
  const servicio = new ServicioVehiculoFalso();
  const controlador = new ControladorVehiculo(servicio as any);
  const req = crearRequestMock({}, { matricula: "A1", tipo: "Auto", capacidad: 4, dispositivoGps: "d1" });
  const res = crearResponseMock();

  await controlador.crearVehiculo(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.matricula, "A1");
}

async function obtenerVehiculosPrueba() {
  const servicio = new ServicioVehiculoFalso();
  await servicio.crearVehiculo("B1", "Camion", 1000, "d2");
  const controlador = new ControladorVehiculo(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  await controlador.obtenerVehiculos(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.length, 1);
}

async function obtenerVehiculoPorIdPrueba() {
  const servicio = new ServicioVehiculoFalso();
  const vehiculo = await servicio.crearVehiculo("C1", "Auto", 4, "d3");
  const controlador = new ControladorVehiculo(servicio as any);
  const req = crearRequestMock({ id: vehiculo.id.toString() }, {});
  const res = crearResponseMock();

  await controlador.obtenerVehiculoPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.matricula, "C1");
}

async function actualizarVehiculoPrueba() {
  const servicio = new ServicioVehiculoFalso();
  const vehiculo = await servicio.crearVehiculo("OLD", "Auto", 4, "d1");
  const controlador = new ControladorVehiculo(servicio as any);
  const req = crearRequestMock({ id: vehiculo.id.toString() }, { matricula: "NEW", tipo: "Camion", capacidad: 500, dispositivoGps: "d2" });
  const res = crearResponseMock();

  await controlador.actualizarVehiculo(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.matricula, "NEW");
}

async function eliminarVehiculoPrueba() {
  const servicio = new ServicioVehiculoFalso();
  const vehiculo = await servicio.crearVehiculo("DEL", "Auto", 4, "d1");
  const controlador = new ControladorVehiculo(servicio as any);
  const req = crearRequestMock({ id: vehiculo.id.toString() }, {});
  const res = crearResponseMock();

  await controlador.eliminarVehiculo(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear vehículo", crearVehiculoPrueba],
  ["Obtener vehículos", obtenerVehiculosPrueba],
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
  ejecutarPruebas().catch(error => {
    console.error("❌ Error en las pruebas:", error);
    process.exit(1);
  });
}
