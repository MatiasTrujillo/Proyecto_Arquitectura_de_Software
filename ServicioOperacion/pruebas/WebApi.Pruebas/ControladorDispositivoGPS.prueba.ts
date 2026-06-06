import assert from "assert";
import { ControladorDispositivoGPS } from "../../src/ModuloVehiculos/WebApi/Controlador/ControladorDispositivoGPS";
import { DispositivoGPSDTO } from "../../src/ModuloVehiculos/DTOs/DispositivoGPSDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioDispositivoGPSFalso {
  private data: DispositivoGPSDTO[] = [];
  private id = 1;

  async crearDispositivoGPS(ubicacion: string): Promise<DispositivoGPSDTO> {
    const dispositivo = new DispositivoGPSDTO(this.id++, ubicacion);
    this.data.push(dispositivo);
    return dispositivo;
  }

  async obtenerDispositivosGPS(): Promise<DispositivoGPSDTO[]> {
    return this.data;
  }

  async obtenerDispositivoGPSPorId(id: number): Promise<DispositivoGPSDTO> {
    const encontrado = this.data.find((d) => d.toEntity().getId() === id);
    if (!encontrado) throw new Error("DispositivoGPS no encontrado");
    return encontrado;
  }

  async actualizarDispositivoGPS(id: number, ubicacion: string): Promise<DispositivoGPSDTO> {
    const index = this.data.findIndex((d) => d.toEntity().getId() === id);
    if (index === -1) throw new Error("DispositivoGPS no encontrado");
    const actualizado = new DispositivoGPSDTO(id, ubicacion);
    this.data[index] = actualizado;
    return actualizado;
  }

  async eliminarDispositivoGPS(id: number): Promise<void> {
    const index = this.data.findIndex((d) => d.toEntity().getId() === id);
    if (index === -1) throw new Error("DispositivoGPS no encontrado");
    this.data.splice(index, 1);
  }
}

async function crearDispositivoGPSPrueba() {
  const servicio = new ServicioDispositivoGPSFalso();
  const controlador = new ControladorDispositivoGPS(servicio as any);
  const req = crearRequestMock({}, { ubicacion: "Ubicación A" });
  const res = crearResponseMock();

  await controlador.crearDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.toEntity().getUbicacion(), "Ubicación A");
}

async function obtenerDispositivoGPSPrueba() {
  const servicio = new ServicioDispositivoGPSFalso();
  await servicio.crearDispositivoGPS("Ubicación B");
  const controlador = new ControladorDispositivoGPS(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  await controlador.obtenerDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.length, 1);
}

async function obtenerDispositivoGPSPorIdPrueba() {
  const servicio = new ServicioDispositivoGPSFalso();
  const dispositivo = await servicio.crearDispositivoGPS("Ubicación C");
  const controlador = new ControladorDispositivoGPS(servicio as any);
  const req = crearRequestMock({ id: dispositivo.toEntity().getId().toString() }, {});
  const res = crearResponseMock();

  await controlador.obtenerDispositivoGPSPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.toEntity().getUbicacion(), "Ubicación C");
}

async function actualizarDispositivoGPSPrueba() {
  const servicio = new ServicioDispositivoGPSFalso();
  const dispositivo = await servicio.crearDispositivoGPS("Ubicación original");
  const controlador = new ControladorDispositivoGPS(servicio as any);
  const req = crearRequestMock({ id: dispositivo.toEntity().getId().toString() }, { ubicacion: "Ubicación actualizada" });
  const res = crearResponseMock();

  await controlador.actualizarDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.toEntity().getUbicacion(), "Ubicación actualizada");
}

async function eliminarDispositivoGPSPrueba() {
  const servicio = new ServicioDispositivoGPSFalso();
  const dispositivo = await servicio.crearDispositivoGPS("Ubicación a eliminar");
  const controlador = new ControladorDispositivoGPS(servicio as any);
  const req = crearRequestMock({ id: dispositivo.toEntity().getId().toString() }, {});
  const res = crearResponseMock();

  await controlador.eliminarDispositivoGPS(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear dispositivo GPS", crearDispositivoGPSPrueba],
  ["Obtener dispositivos GPS", obtenerDispositivoGPSPrueba],
  ["Obtener dispositivo GPS por id", obtenerDispositivoGPSPorIdPrueba],
  ["Actualizar dispositivo GPS", actualizarDispositivoGPSPrueba],
  ["Eliminar dispositivo GPS", eliminarDispositivoGPSPrueba],
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
