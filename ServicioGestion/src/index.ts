import 'dotenv/config';
import express from 'express';
import path from 'path';

import { ControladorAdministrador } from './ModuloUsuarios/WebApi/Controlador/ControladorAdministrador';
import { ControladorOperador } from './ModuloUsuarios/WebApi/Controlador/ControladorOperador';
import { ControladorConductor } from './ModuloUsuarios/WebApi/Controlador/ControladorConductor';
import { ControladorClientePersonal } from './ModuloUsuarios/WebApi/Controlador/ControladorClientePersonal';
import { ControladorClienteEmpresa } from './ModuloUsuarios/WebApi/Controlador/ControladorClienteEmpresa';
import { ControladorProducto } from './ModuloCatalogo/WebApi/Controlador/ControladorProducto';
import { ControladorZonaGeografica } from './ModuloCatalogo/WebApi/Controlador/ControladorZonaGeografica';
import { ControladorPago } from './ModuloPagos/WebApi/Controlador/ControladorPago';
import { ControladorReserva } from './ModuloReservas/WebApi/Controlador/ControladorReserva';
import { ControladorViaje } from './ModuloReservas/WebApi/Controlador/ControladorViaje';
import { ControladorIncidente } from './ModuloReservas/WebApi/Controlador/ControladorIncidente';

import { registradorSolicitudes, manejadorErrores } from './Shared/Logging/requestLogger';
import { manejadorMetricas } from './Shared/Metrics/metrics';
import { verificarAutorizacion } from './Shared/Auth/middlewareAuth';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { RepositorioClientesFrecuentes } from './ModuloUsuarios/DataAccess/RepositorioClientesFrecuentes';
import { colaReservas } from './ModuloReservas/WebApi/Cola/ColaPrioridad';

const app = express();
const port = process.env.PORT || 3001;

const administradorController = new ControladorAdministrador();
const operadorController = new ControladorOperador();
const conductorController = new ControladorConductor();
const clientePersonalController = new ControladorClientePersonal();
const clienteEmpresaController = new ControladorClienteEmpresa();
const productoController = new ControladorProducto();
const zonaGeograficaController = new ControladorZonaGeografica();
const pagoController = new ControladorPago();
const reservaController = new ControladorReserva();
const viajeController = new ControladorViaje();
const incidenteController = new ControladorIncidente();

app.use(express.json());
app.use(registradorSolicitudes);
app.use('/api', verificarAutorizacion);

// ─── Administradores ─────────────────────────────────────────────────────────
app.post('/api/administradores', administradorController.crearAdministrador.bind(administradorController));
app.get('/api/administradores', administradorController.obtenerAdministradores.bind(administradorController));
app.get('/api/administradores/:id', administradorController.obtenerAdministradorPorId.bind(administradorController));
app.put('/api/administradores/:id', administradorController.actualizarAdministrador.bind(administradorController));
app.delete('/api/administradores/:id', administradorController.eliminarAdministrador.bind(administradorController));

// ─── Operadores ───────────────────────────────────────────────────────────────
app.post('/api/operadores', operadorController.crearOperador.bind(operadorController));
app.get('/api/operadores', operadorController.obtenerOperador.bind(operadorController));
app.get('/api/operadores/:id', operadorController.obtenerOperadorPorId.bind(operadorController));
app.put('/api/operadores/:id', operadorController.actualizarOperador.bind(operadorController));
app.delete('/api/operadores/:id', operadorController.eliminarOperador.bind(operadorController));
app.post('/api/operadores/:reservaId/asignar-reserva', operadorController.asignarReserva.bind(operadorController));
app.get('/api/operadores/:trasladoId/consultar-traslado', operadorController.consultarTraslado.bind(operadorController));
app.post('/api/operadores/:reservaId/reserva-no-reconocida', operadorController.reservaNoReconocida.bind(operadorController));

// ─── Conductores ──────────────────────────────────────────────────────────────
app.post('/api/conductores', conductorController.crearConductor.bind(conductorController));
app.get('/api/conductores', conductorController.obtenerConductor.bind(conductorController));
app.get('/api/conductores/disponibles', conductorController.obtenerConductoresDisponibles.bind(conductorController));
app.get('/api/conductores/:id', conductorController.obtenerConductorPorId.bind(conductorController));
app.put('/api/conductores/:id', conductorController.actualizarConductor.bind(conductorController));
app.delete('/api/conductores/:id', conductorController.eliminarConductor.bind(conductorController));

// ─── Clientes Personales ──────────────────────────────────────────────────────
app.post('/api/clientes-personales', clientePersonalController.crearClientePersonal.bind(clientePersonalController));
app.get('/api/clientes-personales', clientePersonalController.obtenerClientePersonal.bind(clientePersonalController));
app.post('/api/clientes-personales/calcular-traslado', clientePersonalController.calcularTraslado.bind(clientePersonalController));
app.post('/api/clientes-personales/realizar-reserva', clientePersonalController.realizarReserva.bind(clientePersonalController));
app.post('/api/clientes-personales/realizar-pago', clientePersonalController.realizarPago.bind(clientePersonalController));
app.get('/api/clientes-personales/:id', clientePersonalController.obtenerClientePersonalPorId.bind(clientePersonalController));
app.put('/api/clientes-personales/:id', clientePersonalController.actualizarClientePersonal.bind(clientePersonalController));
app.delete('/api/clientes-personales/:id', clientePersonalController.eliminarClientePersonal.bind(clientePersonalController));
app.get('/api/clientes-personales/:clienteId/reservas', clientePersonalController.obtenerReservas.bind(clientePersonalController));
app.get('/api/clientes-personales/reservas/:reservaId/estado', clientePersonalController.consultarEstadoReserva.bind(clientePersonalController));

// ─── Clientes Empresariales ───────────────────────────────────────────────────
app.post('/api/clientes-empresariales', clienteEmpresaController.crearClienteEmpresa.bind(clienteEmpresaController));
app.get('/api/clientes-empresariales', clienteEmpresaController.obtenerClienteEmpresa.bind(clienteEmpresaController));
app.post('/api/clientes-empresariales/calcular-traslado', clienteEmpresaController.calcularTraslado.bind(clienteEmpresaController));
app.post('/api/clientes-empresariales/realizar-reserva', clienteEmpresaController.realizarReserva.bind(clienteEmpresaController));
app.post('/api/clientes-empresariales/realizar-pago', clienteEmpresaController.realizarPago.bind(clienteEmpresaController));
app.post('/api/clientes-empresariales/asociar-producto', clienteEmpresaController.asociarProducto.bind(clienteEmpresaController));
app.post('/api/clientes-empresariales/registrar-origen-frecuente', clienteEmpresaController.registrarOrigenFrecuente.bind(clienteEmpresaController));
app.post('/api/clientes-empresariales/registrar-destino-frecuente', clienteEmpresaController.registrarDestinoFrecuente.bind(clienteEmpresaController));
app.get('/api/clientes-empresariales/frecuentes', clienteEmpresaController.obtenerFrecuentes.bind(clienteEmpresaController));
app.get('/api/clientes-empresariales/:id', clienteEmpresaController.obtenerClienteEmpresaPorId.bind(clienteEmpresaController));
app.put('/api/clientes-empresariales/:id', clienteEmpresaController.actualizarClienteEmpresa.bind(clienteEmpresaController));
app.delete('/api/clientes-empresariales/:id', clienteEmpresaController.eliminarClienteEmpresa.bind(clienteEmpresaController));
app.get('/api/clientes-empresariales/:clienteId/reservas', clienteEmpresaController.obtenerReservas.bind(clienteEmpresaController));
app.get('/api/clientes-empresariales/reservas/:reservaId/estado', clienteEmpresaController.consultarEstadoReserva.bind(clienteEmpresaController));

// ─── Productos ────────────────────────────────────────────────────────────────
app.post('/api/productos', productoController.crearProducto.bind(productoController));
app.get('/api/productos', productoController.obtenerProducto.bind(productoController));
app.get('/api/productos/:id', productoController.obtenerProductoPorId.bind(productoController));
app.put('/api/productos/:id', productoController.actualizarProducto.bind(productoController));
app.delete('/api/productos/:id', productoController.eliminarProducto.bind(productoController));

// ─── Zonas Geográficas ────────────────────────────────────────────────────────
app.post('/api/zonas-geograficas', zonaGeograficaController.crearZona.bind(zonaGeograficaController));
app.get('/api/zonas-geograficas', zonaGeograficaController.obtenerZonas.bind(zonaGeograficaController));
app.get('/api/zonas-geograficas/:id', zonaGeograficaController.obtenerZonaPorId.bind(zonaGeograficaController));
app.put('/api/zonas-geograficas/:id', zonaGeograficaController.actualizarZona.bind(zonaGeograficaController));
app.delete('/api/zonas-geograficas/:id', zonaGeograficaController.eliminarZona.bind(zonaGeograficaController));

// ─── Pagos ────────────────────────────────────────────────────────────────────
app.post('/api/pagos', pagoController.crearPago.bind(pagoController));
app.get('/api/pagos', pagoController.obtenerPago.bind(pagoController));
app.get('/api/pagos/:id', pagoController.obtenerPagoPorId.bind(pagoController));
app.put('/api/pagos/:id', pagoController.actualizarPago.bind(pagoController));
app.delete('/api/pagos/:id', pagoController.eliminarPago.bind(pagoController));

// ─── Priority Queue: clientes frecuentes (R1) ─────────────────────────────────
const repoFrecuentes = new RepositorioClientesFrecuentes();

app.post('/api/clientes-frecuentes/actualizar', async (_req, res) => {
  try {
    const actualizados = await repoFrecuentes.actualizarTop20();
    res.json({ mensaje: `Top 20 actualizado. Clientes frecuentes marcados: ${actualizados}` });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/cola/estado', (_req, res) => {
  res.json({ pendientes: colaReservas.pendientes });
});

// ─── Reservas ─────────────────────────────────────────────────────────────────
app.post('/api/reservas', reservaController.crearReserva.bind(reservaController));
app.get('/api/reservas', reservaController.obtenerReservas.bind(reservaController));
app.get('/api/reservas/sin-viaje', reservaController.obtenerReservasSinViaje.bind(reservaController));
app.get('/api/reservas/:id', reservaController.obtenerReservaPorId.bind(reservaController));
app.patch('/api/reservas/:id/estado', reservaController.actualizarEstadoReserva.bind(reservaController));
app.patch('/api/reservas/:id/asignar', reservaController.asignarVehiculoConductor.bind(reservaController));

// ─── Viajes ───────────────────────────────────────────────────────────────────
app.post('/api/viajes', viajeController.crearViaje.bind(viajeController));
app.get('/api/viajes', viajeController.obtenerViaje.bind(viajeController));
app.get('/api/viajes/en-curso', viajeController.obtenerViajesEnCurso.bind(viajeController));
app.get('/api/viajes/mis-viajes', viajeController.obtenerMisViajes.bind(viajeController));
app.get('/api/viajes/:id', viajeController.obtenerViajePorId.bind(viajeController));
app.put('/api/viajes/:id', viajeController.actualizarViaje.bind(viajeController));
app.delete('/api/viajes/:id', viajeController.eliminarViaje.bind(viajeController));
app.post('/api/viajes/:id/iniciar', viajeController.iniciarTraslado.bind(viajeController));
app.post('/api/viajes/:id/finalizar', viajeController.finalizarTraslado.bind(viajeController));

// ─── Incidentes ───────────────────────────────────────────────────────────────
app.post('/api/incidentes', incidenteController.crearIncidente.bind(incidenteController));
app.get('/api/incidentes', incidenteController.obtenerIncidente.bind(incidenteController));
app.get('/api/incidentes/:id', incidenteController.obtenerIncidentePorId.bind(incidenteController));
app.put('/api/incidentes/:id', incidenteController.actualizarIncidente.bind(incidenteController));
app.delete('/api/incidentes/:id', incidenteController.eliminarIncidente.bind(incidenteController));

// ─── UI y métricas ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'home.html'));
});

app.get('/administradores-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'administradores.html'));
});
app.get('/operadores-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'operadores.html'));
});
app.get('/conductores-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'conductores.html'));
});
app.get('/clientes-personales-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'clientes-personales.html'));
});
app.get('/clientes-empresariales-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'clientes-empresariales.html'));
});
app.get('/productos-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'productos.html'));
});
app.get('/zonas-geograficas-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'zonas-geograficas.html'));
});
app.get('/pagos-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'pagos.html'));
});
app.get('/reservas-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'reservas.html'));
});
app.get('/viajes-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'viajes.html'));
});
app.get('/mis-viajes-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'mis-viajes.html'));
});
app.get('/incidentes-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'incidentes.html'));
});

app.get('/metricas', manejadorMetricas);
app.get('/metricas-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'Metrics', 'metricas.html'));
});

app.use(manejadorErrores);

ejecutarMigraciones()
  .then(async () => {
    // Calcular top 20 clientes frecuentes al arrancar (R1 - Priority Queue)
    try {
      const n = await new RepositorioClientesFrecuentes().actualizarTop20();
      console.log(`[priority-queue] Clientes frecuentes actualizados: ${n}`);
    } catch (e) {
      console.warn('[priority-queue] No se pudo actualizar clientes frecuentes:', e);
    }
    // Repetir cada 7 días
    setInterval(async () => {
      try { await new RepositorioClientesFrecuentes().actualizarTop20(); } catch {}
    }, 7 * 24 * 60 * 60 * 1000);
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`ServicioGestion escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar ServicioGestion:', err);
    process.exit(1);
  });
