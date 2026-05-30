import assert from "assert";
import { ControladorAdministrador } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorAdministrador";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioAdministradorFalso {
  private data: any[] = [];

  crearAdministrador(cedula: string, nombre: string) {
    const administrador = {
      getId: () => "1",
      getCedula: () => cedula,
      getNombre: () => nombre,
      obtenerRol: () => "Administrador",
    };
    this.data.push(administrador);
    return administrador;
  }

  obtenerAdministradores() {
    return this.data;
  }

  obtenerAdministradorPorId(id: string) {
    const encontrado = this.data.find((item) => item.getId() === id);
    if (!encontrado) throw new Error("Administrador no encontrado");
    return encontrado;
  }

  actualizarAdministrador(id: string, cedula: string, nombre: string) {
    const index = this.data.findIndex((item) => item.getId() === id);
    if (index === -1) throw new Error("Administrador no encontrado");
    const actualizado = {
      getId: () => id,
      getCedula: () => cedula,
      getNombre: () => nombre,
      obtenerRol: () => "Administrador",
    };
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarAdministrador(id: string) {
    const index = this.data.findIndex((item) => item.getId() === id);
    if (index === -1) throw new Error("Administrador no encontrado");
    this.data.splice(index, 1);
  }
}

function crearAdministradorPrueba() {
  const servicio = new ServicioAdministradorFalso();
  const controlador = new ControladorAdministrador(servicio as any);
  const req = crearRequestMock({}, { cedula: "123", nombre: "Juan" });
  const res = crearResponseMock();

  controlador.crearAdministrador(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.deepStrictEqual(res.body.data, {
    id: "1",
    cedula: "123",
    nombre: "Juan",
    rol: "Administrador",
  });
}

function obtenerAdministradoresPrueba() {
  const servicio = new ServicioAdministradorFalso();
  const administrador = servicio.crearAdministrador("321", "Ana");
  const controlador = new ControladorAdministrador(servicio as any);
  const req = crearRequestMock();
  const res = crearResponseMock();

  controlador.obtenerAdministradores(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.length, 1);
  assert.strictEqual(res.body.data[0].cedula, administrador.getCedula());
}

function obtenerAdministradorPorIdPrueba() {
  const servicio = new ServicioAdministradorFalso();
  const administrador = servicio.crearAdministrador("555", "Pedro");
  const controlador = new ControladorAdministrador(servicio as any);
  const req = crearRequestMock({ id: administrador.getId() }, {});
  const res = crearResponseMock();

  controlador.obtenerAdministradorPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "Pedro");
}

function actualizarAdministradorPrueba() {
  const servicio = new ServicioAdministradorFalso();
  const administrador = servicio.crearAdministrador("222", "Old");
  const controlador = new ControladorAdministrador(servicio as any);
  const req = crearRequestMock({ id: administrador.getId() }, { cedula: "222", nombre: "New" });
  const res = crearResponseMock();

  controlador.actualizarAdministrador(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

function eliminarAdministradorPrueba() {
  const servicio = new ServicioAdministradorFalso();
  const administrador = servicio.crearAdministrador("77", "X");
  const controlador = new ControladorAdministrador(servicio as any);
  const req = crearRequestMock({ id: administrador.getId() }, {});
  const res = crearResponseMock();

  controlador.eliminarAdministrador(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
  assert.strictEqual(res.sent, true);
}

const pruebas = [
  ["Crear administrador", crearAdministradorPrueba],
  ["Obtener administradores", obtenerAdministradoresPrueba],
  ["Obtener administrador por id", obtenerAdministradorPorIdPrueba],
  ["Actualizar administrador", actualizarAdministradorPrueba],
  ["Eliminar administrador", eliminarAdministradorPrueba],
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
