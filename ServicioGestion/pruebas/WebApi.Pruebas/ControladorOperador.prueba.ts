import assert from "assert";
import { ControladorOperador } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorOperador";
import { OperadorDTO } from "../../src/ModuloUsuarios/DTOs/OperadorDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioOperadorFalso {
  private data: OperadorDTO[] = [];
  private next = 1;

  crearOperador(cedula: string, nombre: string): OperadorDTO {
    const operador = new OperadorDTO(`${this.next++}`, cedula, nombre);
    this.data.push(operador);
    return operador;
  }

  obtenerOperadores(): OperadorDTO[] {
    return this.data;
  }

  obtenerOperadorPorId(id: string): OperadorDTO {
    const operador = this.data.find((item) => item.id === id);
    if (!operador) throw new Error("Operador no encontrado");
    return operador;
  }

  actualizarOperador(id: string, cedula: string, nombre: string): OperadorDTO {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Operador no encontrado");
    const actualizado = new OperadorDTO(id, cedula, nombre);
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarOperador(id: string): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Operador no encontrado");
    this.data.splice(index, 1);
  }
}

function crearOperadorPrueba() {
  const controlador = new ControladorOperador(new ServicioOperadorFalso() as any);
  const req = crearRequestMock({}, { cedula: "123", nombre: "Luis" });
  const res = crearResponseMock();

  controlador.crearOperador(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.nombre, "Luis");
}

function obtenerOperadoresPrueba() {
  const servicio = new ServicioOperadorFalso();
  servicio.crearOperador("111", "Ana");
  const controlador = new ControladorOperador(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerOperador(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data[0].cedula, "111");
}

function obtenerOperadorPorIdPrueba() {
  const servicio = new ServicioOperadorFalso();
  const operador = servicio.crearOperador("222", "Carlos");
  const controlador = new ControladorOperador(servicio as any);
  const req = crearRequestMock({ id: operador.id }, {});
  const res = crearResponseMock();

  controlador.obtenerOperadorPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "Carlos");
}

function actualizarOperadorPrueba() {
  const servicio = new ServicioOperadorFalso();
  const operador = servicio.crearOperador("333", "Old");
  const controlador = new ControladorOperador(servicio as any);
  const req = crearRequestMock({ id: operador.id }, { cedula: "333", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarOperador(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarOperadorPrueba() {
  const servicio = new ServicioOperadorFalso();
  const operador = servicio.crearOperador("444", "X");
  const controlador = new ControladorOperador(servicio as any);
  const req = crearRequestMock({ id: operador.id }, {});
  const res = crearResponseMock();

  controlador.eliminarOperador(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

const pruebas = [
  ["Crear operador", crearOperadorPrueba],
  ["Obtener operadores", obtenerOperadoresPrueba],
  ["Obtener operador por id", obtenerOperadorPorIdPrueba],
  ["Actualizar operador", actualizarOperadorPrueba],
  ["Eliminar operador", eliminarOperadorPrueba],
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
