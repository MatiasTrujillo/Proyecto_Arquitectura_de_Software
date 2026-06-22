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
import * as reglaCtrl from './ModuloCatalogo/WebApi/Controlador/ControladorReglaCategoria';
import { compararMetodos, clasificarRapido } from './ModuloCatalogo/Servicio/ServicioClasificacion';
import { busEventos, EVENTO_RESERVA_CREADA, EVENTO_RESERVA_NO_RECONOCIDA, PayloadReservaNoReconocida, PayloadReservaCreada } from './Shared/Eventos/BusEventos';

import { registradorSolicitudes, manejadorErrores } from './Shared/Logging/requestLogger';
import { manejadorMetricas } from './Shared/Metrics/metrics';
import { verificarAutorizacion } from './Shared/Auth/middlewareAuth';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { seedCategorias } from './Shared/Database/SeedCategorias';
import { RepositorioClientesFrecuentes } from './ModuloUsuarios/DataAccess/RepositorioClientesFrecuentes';
import { colaReservas } from './ModuloReservas/WebApi/Cola/ColaPrioridad';
import pool from './Shared/Database/DatabaseConnection';

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
// ─── Categorías y Reglas (F8) ─────────────────────────────────────────────────
app.get('/api/categorias', reglaCtrl.obtenerCategorias);
app.post('/api/categorias', reglaCtrl.crearCategoria);
app.get('/api/reglas', reglaCtrl.obtenerReglas);
app.post('/api/reglas', reglaCtrl.crearRegla);
app.put('/api/reglas/:id', reglaCtrl.actualizarRegla);
app.delete('/api/reglas/:id', reglaCtrl.eliminarRegla);

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
app.get('/api/viajes/vehiculos-ocupados', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT r.vehiculo FROM reserva r
       LEFT JOIN viaje v ON v.reserva_id = r.id::text
       WHERE r.vehiculo IS NOT NULL AND r.vehiculo != ''
         AND r.estado != 'Cancelado'
         AND (v.id IS NULL OR v.estado NOT IN ('Finalizado', 'Cancelado'))`
    );
    res.json({ data: result.rows.map((r: any) => r.vehiculo) });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
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

// ─── Endpoints internos (sin autenticación, para comunicación entre servicios) ──
app.get('/internal/zonas-geograficas', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, delimitacion_geografica AS delimitacion, tipo FROM zona_geografica`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/internal/viajes/en-curso', async (req, res) => {
  try {
    const { vehiculo, conductor, categoria, tieneAlertas } = req.query;
    const condiciones: string[] = ["v.estado NOT IN ('Finalizado', 'Cancelado')"];
    const valores: any[] = [];

    if (vehiculo) {
      valores.push(vehiculo);
      condiciones.push(`v.vehiculo = $${valores.length}`);
    }
    if (conductor) {
      valores.push(conductor);
      condiciones.push(`v.conductor = $${valores.length}`);
    }
    if (categoria) {
      valores.push(categoria);
      condiciones.push(`$${valores.length} = ANY(r.categorias)`);
    }
    if (tieneAlertas !== undefined && tieneAlertas !== '') {
      valores.push(tieneAlertas === 'true');
      condiciones.push(`v.tiene_alertas = $${valores.length}`);
    }

    const joinClause = categoria
      ? 'LEFT JOIN reserva r ON r.id::text = v.reserva_id'
      : '';

    const result = await pool.query(
      `SELECT v.id, v.reserva_id, v.origen, v.destino, v.fecha, v.estado, v.conductor, v.vehiculo, v.tiene_alertas
       FROM viaje v ${joinClause}
       WHERE ${condiciones.join(' AND ')}
       ORDER BY v.fecha ASC`,
      valores
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.patch('/internal/viajes/vehiculo/:matricula/alertas', async (req, res) => {
  try {
    await pool.query(
      `UPDATE viaje SET tiene_alertas = true
       WHERE vehiculo = $1 AND estado NOT IN ('Finalizado', 'Cancelado')`,
      [req.params.matricula]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

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
app.get('/categorias-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'categorias.html'));
});
app.get('/reservas-no-reconocidas-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'reservas-no-reconocidas.html'));
});

// ── F19: SSE — operadores suscritos reciben notificaciones en tiempo real ──────
// Patrón pub/sub: el servidor publica eventos en el bus interno;
// este endpoint actúa como adaptador bus → SSE (HTTP streaming).
const sseClients: Set<import('express').Response> = new Set();

app.get('/api/notificaciones/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write('data: {"tipo":"conectado"}\n\n');

  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

// Suscriptor 1: clasifica la reserva cuando se crea
busEventos.on(EVENTO_RESERVA_CREADA, async (payload: PayloadReservaCreada) => {
  try {
    if (payload.productosIds.length === 0) return;
    const prodRes = await pool.query(
      'SELECT descripcion FROM producto WHERE id = ANY($1::int[])',
      [payload.productosIds]
    );
    const descripciones: string[] = prodRes.rows.map((r: any) => r.descripcion).filter(Boolean);
    if (descripciones.length === 0) return;

    const descripcionCombinada = descripciones.join('. ');
    const resultados = await clasificarRapido(descripcionCombinada, async (iaResult) => {
      if (iaResult.categoria) {
        await pool.query(
          `UPDATE reserva SET categorias = array_append(categorias, $1) WHERE id = $2 AND NOT ($1 = ANY(categorias))`,
          [iaResult.categoria, payload.reservaId]
        ).catch(() => {});
      }
    });

    const encontradas = [...new Set(resultados.map(r => r.categoria).filter((c): c is string => c !== null))];
    if (encontradas.length > 0) {
      await pool.query('UPDATE reserva SET categorias = $1 WHERE id = $2', [encontradas, payload.reservaId]);
    } else {
      // Suscriptor publica segundo evento — ningún método rápido clasificó
      busEventos.emit(EVENTO_RESERVA_NO_RECONOCIDA, {
        reservaId: payload.reservaId,
        clienteId: payload.clienteId,
        descripcionesBienes: descripciones,
        resultadosClasificacion: resultados,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error('[ClasificacionSuscriptor]', e);
  }
});

// Suscriptor 2: notifica a operadores conectados por SSE
busEventos.on(EVENTO_RESERVA_NO_RECONOCIDA, (payload: PayloadReservaNoReconocida) => {
  const data = JSON.stringify({ tipo: 'reserva-no-reconocida', ...payload });
  for (const client of sseClients) {
    client.write(`data: ${data}\n\n`);
  }
});

// ── R10: endpoint de comparación de los 3 métodos ─────────────────────────────
app.post('/api/clasificacion/comparar', async (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) { res.status(400).json({ error: 'descripcion requerida' }); return; }
  try {
    const resultados = await compararMetodos(String(descripcion));
    res.json({ descripcion, resultados });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── F19: operador asigna categoría manualmente a reserva no reconocida ─────────
app.patch('/api/reservas/:id/categorias', async (req, res) => {
  const { categorias } = req.body;
  if (!categorias || !Array.isArray(categorias)) { res.status(400).json({ error: 'categorias requeridas' }); return; }
  try {
    await pool.query('UPDATE reserva SET categorias = $1 WHERE id = $2', [categorias, req.params.id]);
    res.json({ mensaje: 'Categorías asignadas' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── F19: bien fuera de catálogo → simular envío de correo al cliente ───────────
app.post('/api/reservas/:id/notificar-sin-categoria', async (req, res) => {
  const { clienteId } = req.body;
  console.log(`[F19] Correo enviado a cliente ${clienteId}: reserva ${req.params.id} no puede satisfacerse`);
  res.json({ mensaje: `Correo notificado al cliente ${clienteId}` });
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
    // Seed categorías MOVE desde CSV
    await seedCategorias();

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
