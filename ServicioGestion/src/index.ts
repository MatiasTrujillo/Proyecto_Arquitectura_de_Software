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
import { compararMetodos, clasificarConKeyword, clasificarConTFIDF, clasificarConIA } from './ModuloCatalogo/Servicio/ServicioClasificacion';
import { busEventos, EVENTO_RESERVA_CREADA, EVENTO_RESERVA_NO_RECONOCIDA, PayloadReservaNoReconocida, PayloadReservaCreada } from './Shared/Eventos/BusEventos';

import { registradorSolicitudes, manejadorErrores } from './Shared/Logging/requestLogger';
import { manejadorMetricas } from './Shared/Metrics/metrics';
import { verificarAutorizacion } from './Shared/Auth/middlewareAuth';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { seedCategorias } from './Shared/Database/SeedCategorias';
import { ejecutarSeed } from './Shared/Database/SeedRunner';
import { RepositorioClientesFrecuentes } from './ModuloUsuarios/DataAccess/RepositorioClientesFrecuentes';
import { colaReservas } from './ModuloReservas/WebApi/Cola/ColaPrioridad';
import pool from './Shared/Database/DatabaseConnection';

const app = express();
const port = process.env.PORT || 3001;

const administradorController = new ControladorAdministrador();
const operadorController      = new ControladorOperador();
const conductorController     = new ControladorConductor();
const clientePersonalController  = new ControladorClientePersonal();
const clienteEmpresaController   = new ControladorClienteEmpresa();
const productoController         = new ControladorProducto();
const zonaGeograficaController   = new ControladorZonaGeografica();
const pagoController             = new ControladorPago();
const reservaController          = new ControladorReserva();
const viajeController            = new ControladorViaje();
const incidenteController        = new ControladorIncidente();

app.use(express.json());
app.use(registradorSolicitudes);
app.use('/api', verificarAutorizacion);

import fs from 'fs';

function sendHtml(res: any, filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(content);
}

// â”€â”€â”€ Administradores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/administradores',    administradorController.crearAdministrador);
app.get('/api/administradores',     administradorController.obtenerAdministradores);
app.get('/api/administradores/:id', administradorController.obtenerAdministradorPorId);
app.put('/api/administradores/:id', administradorController.actualizarAdministrador);
app.delete('/api/administradores/:id', administradorController.eliminarAdministrador);

// â”€â”€â”€ Operadores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/operadores',    operadorController.crearOperador);
app.get('/api/operadores',     operadorController.obtenerOperador);
app.get('/api/operadores/:id', operadorController.obtenerOperadorPorId);
app.put('/api/operadores/:id', operadorController.actualizarOperador);
app.delete('/api/operadores/:id', operadorController.eliminarOperador);
app.post('/api/operadores/:reservaId/asignar-reserva',    operadorController.asignarReserva);
app.post('/api/operadores/:reservaId/reserva-no-reconocida', operadorController.reservaNoReconocida);

// â”€â”€â”€ Conductores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/conductores',           conductorController.crearConductor);
app.get('/api/conductores',            conductorController.obtenerConductor);
app.get('/api/conductores/disponibles', conductorController.obtenerConductoresDisponibles);
app.get('/api/conductores/:id',        conductorController.obtenerConductorPorId);
app.put('/api/conductores/:id',        conductorController.actualizarConductor);
app.delete('/api/conductores/:id',     conductorController.eliminarConductor);

// â”€â”€â”€ Clientes Personales â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/clientes-personales',                    clientePersonalController.crearClientePersonal);
app.get('/api/clientes-personales',                     clientePersonalController.obtenerClientePersonal);
app.post('/api/clientes-personales/realizar-reserva',   clientePersonalController.realizarReserva);
app.post('/api/clientes-personales/realizar-pago',      clientePersonalController.realizarPago);
app.get('/api/clientes-personales/:id',                 clientePersonalController.obtenerClientePersonalPorId);
app.put('/api/clientes-personales/:id',                 clientePersonalController.actualizarClientePersonal);
app.delete('/api/clientes-personales/:id',              clientePersonalController.eliminarClientePersonal);
app.get('/api/clientes-personales/:clienteId/reservas', clientePersonalController.obtenerReservas);
app.get('/api/clientes-personales/reservas/:reservaId/estado', clientePersonalController.consultarEstadoReserva);
app.get('/api/clientes-personales/reservas/:id/productos', async (req, res) => {
  try {
    const { RepositorioProductoReserva } = await import('./ModuloReservas/DataAccess/RepositorioProductoReserva');
    const repo = new RepositorioProductoReserva();
    const productos = await repo.obtenerPorReserva(Number(req.params.id));
    res.json({ data: productos });
  } catch { res.status(500).json({ error: 'Error al obtener productos' }); }
});

// â”€â”€â”€ Clientes Empresariales â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/clientes-empresariales',                       clienteEmpresaController.crearClienteEmpresa);
app.get('/api/clientes-empresariales',                        clienteEmpresaController.obtenerClienteEmpresa);
app.post('/api/clientes-empresariales/realizar-reserva',      clienteEmpresaController.realizarReserva);
app.post('/api/clientes-empresariales/realizar-pago',         clienteEmpresaController.realizarPago);
app.post('/api/clientes-empresariales/me/preregistros',       clienteEmpresaController.crearPreregistro);
app.get('/api/clientes-empresariales/me/preregistros',        clienteEmpresaController.obtenerPreregistros);
app.get('/api/clientes-empresariales/me/preregistros/producto/:productoId', clienteEmpresaController.obtenerPreregistroPorProducto);
app.delete('/api/clientes-empresariales/me/preregistros/:id', clienteEmpresaController.eliminarPreregistro);
app.get('/api/clientes-empresariales/me/reservas',            clienteEmpresaController.obtenerReservas);
app.get('/api/clientes-empresariales/reservas/:id/productos', async (req, res) => {
  try {
    const { RepositorioProductoReserva } = await import('./ModuloReservas/DataAccess/RepositorioProductoReserva');
    const repo = new RepositorioProductoReserva();
    const productos = await repo.obtenerPorReserva(Number(req.params.id));
    res.json({ data: productos });
  } catch { res.status(500).json({ error: 'Error al obtener productos' }); }
});
app.post('/api/clientes-empresariales/registrar-origen-frecuente',  clienteEmpresaController.registrarOrigenFrecuente);
app.post('/api/clientes-empresariales/registrar-destino-frecuente', clienteEmpresaController.registrarDestinoFrecuente);
app.get('/api/clientes-empresariales/frecuentes',                   clienteEmpresaController.obtenerFrecuentes);
app.get('/api/clientes-empresariales/:id',                          clienteEmpresaController.obtenerClienteEmpresaPorId);
app.put('/api/clientes-empresariales/:id',                          clienteEmpresaController.actualizarClienteEmpresa);
app.delete('/api/clientes-empresariales/:id',                       clienteEmpresaController.eliminarClienteEmpresa);
app.get('/api/clientes-empresariales/:clienteId/reservas',          clienteEmpresaController.obtenerReservas);
app.get('/api/clientes-empresariales/reservas/:reservaId/estado',   clienteEmpresaController.consultarEstadoReserva);

// â”€â”€â”€ Productos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/productos',    productoController.crearProducto);
app.get('/api/productos',     productoController.obtenerProducto);
app.get('/api/productos/:id', productoController.obtenerProductoPorId);
app.put('/api/productos/:id', productoController.actualizarProducto);
app.delete('/api/productos/:id', productoController.eliminarProducto);

// â”€â”€â”€ CategorÃ­as y Reglas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/api/categorias',     reglaCtrl.obtenerCategorias);
app.post('/api/categorias',    reglaCtrl.crearCategoria);
app.get('/api/reglas',         reglaCtrl.obtenerReglas);
app.post('/api/reglas',        reglaCtrl.crearRegla);
app.put('/api/reglas/:id',     reglaCtrl.actualizarRegla);
app.delete('/api/reglas/:id',  reglaCtrl.eliminarRegla);

// â”€â”€â”€ Zonas GeogrÃ¡ficas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/zonas-geograficas',    zonaGeograficaController.crearZona);
app.get('/api/zonas-geograficas',     zonaGeograficaController.obtenerZonas);
app.get('/api/zonas-geograficas/:id', zonaGeograficaController.obtenerZonaPorId);
app.put('/api/zonas-geograficas/:id', zonaGeograficaController.actualizarZona);
app.delete('/api/zonas-geograficas/:id', zonaGeograficaController.eliminarZona);

// â”€â”€â”€ Pagos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/pagos',    pagoController.crearPago);
app.get('/api/pagos',     pagoController.obtenerPago);
app.get('/api/pagos/:id', pagoController.obtenerPagoPorId);
app.put('/api/pagos/:id', pagoController.actualizarPago);
app.delete('/api/pagos/:id', pagoController.eliminarPago);

// â”€â”€â”€ Clientes frecuentes y cola â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Reservas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/api/cotizacion/desglose', verificarAutorizacion, async (req, res) => {
  try {
    const costo = Number(req.query.costo);
    const categorias = req.query.categorias ? String(req.query.categorias).split(',').filter(Boolean) : [];
    if (!costo || categorias.length === 0) {
      res.json({ data: { total: costo || 0, base: costo || 0, recargo: 0, porcentaje: 0, categoriaAplicada: null } });
      return;
    }
    const result = await pool.query(
      `SELECT rc.recargo_porcentaje, c.nombre_es AS categoria
       FROM regla_categoria rc
       JOIN categoria c ON c.id = rc.categoria_id
       WHERE c.nombre = ANY($1) OR c.nombre_es = ANY($1)
       ORDER BY rc.recargo_porcentaje DESC LIMIT 1`,
      [categorias]
    );
    const porcentaje = Number(result.rows[0]?.recargo_porcentaje ?? 0);
    const categoriaAplicada = result.rows[0]?.categoria ?? null;
    const base = porcentaje > 0 ? Math.round(costo / (1 + porcentaje / 100)) : costo;
    const recargo = costo - base;
    res.json({ data: { total: costo, base, recargo, porcentaje, categoriaAplicada } });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
app.post('/api/reservas',         reservaController.crearReserva);
app.get('/api/reservas',          reservaController.obtenerReservas);
app.get('/api/reservas/sin-viaje', reservaController.obtenerReservasSinViaje);
app.get('/api/reservas/sin-clasificar', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id AS reserva_id, r.cliente,
              COALESCE(json_agg(br.descripcion) FILTER (WHERE br.descripcion IS NOT NULL), '[]') AS descripciones_bienes
       FROM reserva r
       LEFT JOIN bien_reserva br ON br.reserva_id = r.id
       WHERE cardinality(r.categorias) = 0 AND r.estado != 'Cancelado'
       GROUP BY r.id, r.cliente
       ORDER BY r.id DESC`
    );
    res.json({ data: result.rows });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/api/reservas/:id',           reservaController.obtenerReservaPorId);
app.patch('/api/reservas/:id/estado',  reservaController.actualizarEstadoReserva);
app.patch('/api/reservas/:id/asignar', reservaController.asignarVehiculoConductor);

// â”€â”€â”€ Viajes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/viajes',             viajeController.crearViaje);
app.get('/api/viajes',              viajeController.obtenerViaje);
app.get('/api/viajes/en-curso',     viajeController.obtenerViajesEnCurso);
app.get('/api/viajes/mis-viajes',   viajeController.obtenerMisViajes);
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
app.get('/api/viajes/conductores-ocupados', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT r.conductor FROM reserva r
       LEFT JOIN viaje v ON v.reserva_id = r.id::text
       WHERE r.conductor IS NOT NULL AND r.conductor != ''
         AND r.estado != 'Cancelado'
         AND (v.id IS NULL OR v.estado NOT IN ('Finalizado', 'Cancelado'))`
    );
    res.json({ data: result.rows.map((r: any) => r.conductor) });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
app.get('/api/viajes/:id',        viajeController.obtenerViajePorId);
app.put('/api/viajes/:id',        viajeController.actualizarViaje);
app.delete('/api/viajes/:id',     viajeController.eliminarViaje);
app.post('/api/viajes/:id/iniciar',   viajeController.iniciarTraslado);
app.post('/api/viajes/:id/finalizar', viajeController.finalizarTraslado);

// â”€â”€â”€ Incidentes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/incidentes',    incidenteController.crearIncidente);
app.get('/api/incidentes',     incidenteController.obtenerIncidente);
app.get('/api/incidentes/:id', incidenteController.obtenerIncidentePorId);
app.put('/api/incidentes/:id', incidenteController.actualizarIncidente);
app.delete('/api/incidentes/:id', incidenteController.eliminarIncidente);

// ─── Endpoints internos (sin autenticación, para comunicación entre servicios) ──
app.get('/internal/existe-cedula/:cedula', async (req, res) => {
  const { cedula } = req.params;
  try {
    const tablas = ['administrador', 'conductor', 'operador', 'cliente_personal', 'cliente_empresa'];
    for (const tabla of tablas) {
      const r = await pool.query(`SELECT 1 FROM ${tabla} WHERE cedula = $1`, [cedula]);
      if ((r.rowCount ?? 0) > 0) { res.json({ existe: true }); return; }
    }
    res.json({ existe: false });
  } catch {
    res.json({ existe: false });
  }
});
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

    if (vehiculo)  { valores.push(vehiculo);  condiciones.push(`v.vehiculo = $${valores.length}`); }
    if (conductor) { valores.push(conductor); condiciones.push(`v.conductor = $${valores.length}`); }
    if (categoria) { valores.push(categoria); condiciones.push(`$${valores.length} = ANY(r.categorias)`); }
    if (tieneAlertas !== undefined && tieneAlertas !== '') {
      valores.push(tieneAlertas === 'true');
      condiciones.push(`v.tiene_alertas = $${valores.length}`);
    }

    const joinClause = categoria ? 'LEFT JOIN reserva r ON r.id::text = v.reserva_id' : '';

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

// â”€â”€â”€ SSE: notificaciones en tiempo real para operadores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

busEventos.on(EVENTO_RESERVA_CREADA, async (payload: PayloadReservaCreada) => {
  try {
    const bienes: Array<{ productoId?: number; descripcion: string; categorias?: string[] }> = (payload as any).bienes ?? [];

    const todasCategorizadas = bienes.length > 0 && bienes.every((b: any) => b.categorias?.length > 0);
    if (todasCategorizadas) {
      const cats = [...new Set(bienes.flatMap((b: any) => b.categorias as string[]))];
      await pool.query('UPDATE reserva SET categorias = $1 WHERE id = $2', [cats, payload.reservaId]);
      return;
    }

    const bienesDB = await pool.query(
      `SELECT br.id, br.descripcion, br.producto_id, p.nombre AS producto_nombre
       FROM bien_reserva br LEFT JOIN producto p ON p.id = br.producto_id
       WHERE br.reserva_id = $1 ORDER BY br.id ASC`,
      [payload.reservaId]
    );

    const todasCategorias = new Set<string>();
    const descripciones: string[] = [];
    let hayBienSinCategoria = false;

    for (const row of bienesDB.rows) {
      const descripcion = row.descripcion || '';
      if (descripcion) descripciones.push(descripcion);
      const texto = row.producto_nombre ? `${row.producto_nombre}: ${descripcion}` : descripcion;
      if (!texto.trim()) continue;

      const [kwResult, tfidfResult] = await Promise.all([
        clasificarConKeyword(texto),
        clasificarConTFIDF(texto),
      ]);

      const cats: string[] = [];
      if (tfidfResult.categoria) cats.push(tfidfResult.categoria);
      else if (kwResult.categoria) cats.push(kwResult.categoria);

      if (cats.length > 0) {
        await pool.query('UPDATE bien_reserva SET categorias = $1 WHERE id = $2', [cats, row.id]).catch(() => {});
        cats.forEach(c => todasCategorias.add(c));
      } else {
        hayBienSinCategoria = true;
        const textoLocal = texto;
        const bienIdLocal = row.id;
        clasificarConIA(textoLocal).then(async (iaResult) => {
          if (iaResult.categoria) {
            await pool.query('UPDATE bien_reserva SET categorias = $1 WHERE id = $2', [[iaResult.categoria], bienIdLocal]).catch(() => {});
            await pool.query(
              `UPDATE reserva SET categorias = array_append(categorias, $1) WHERE id = $2 AND NOT ($1 = ANY(categorias))`,
              [iaResult.categoria, payload.reservaId]
            ).catch(() => {});
          }
        }).catch(() => {});
      }
    }

    const encontradas = [...todasCategorias];
    if (encontradas.length > 0) {
      await pool.query('UPDATE reserva SET categorias = $1 WHERE id = $2', [encontradas, payload.reservaId]);
    }
    if (hayBienSinCategoria && encontradas.length === 0) {
      busEventos.emit(EVENTO_RESERVA_NO_RECONOCIDA, {
        reservaId: payload.reservaId,
        clienteId: payload.clienteId,
        descripcionesBienes: descripciones,
        resultadosClasificacion: [],
        timestamp: new Date().toISOString(),
      });
    }
  } catch {
    // clasificación IA en background — si falla no afecta la reserva
  }
});

busEventos.on(EVENTO_RESERVA_NO_RECONOCIDA, (payload: PayloadReservaNoReconocida) => {
  const data = JSON.stringify({ tipo: 'reserva-no-reconocida', ...payload });
  for (const client of sseClients) {
    client.write(`data: ${data}\n\n`);
  }
});

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

app.patch('/api/reservas/:id/categorias', async (req, res) => {
  const { categorias } = req.body;
  if (!categorias || !Array.isArray(categorias)) { res.status(400).json({ error: 'categorias requeridas' }); return; }
  try {
    await pool.query('UPDATE reserva SET categorias = $1 WHERE id = $2', [categorias, req.params.id]);
    res.json({ mensaje: 'CategorÃ­as asignadas' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/reservas/:id/notificar-sin-categoria', async (req, res) => {
  const { clienteId } = req.body;
  const reservaId = req.params.id;
  try {
    await pool.query("UPDATE reserva SET estado = 'Cancelado' WHERE id = $1", [reservaId]);
    await pool.query(
      `INSERT INTO correo (cliente, reserva_id, asunto, mensaje) VALUES ($1, $2, $3, $4)`,
      [
        clienteId,
        reservaId,
        `Reserva #${reservaId} cancelada`,
        `Lamentablemente no podemos satisfacer su reserva #${reservaId}. El bien indicado no se encuentra dentro de las categorÃ­as que maneja MOVE. Si tiene consultas, contÃ¡ctese con nosotros.`,
      ]
    );
    res.json({ mensaje: `Reserva cancelada y correo enviado al cliente ${clienteId}` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/correos', async (req, res) => {
  const { cliente } = req.query;
  if (!cliente) { res.status(400).json({ error: 'cliente requerido' }); return; }
  try {
    const result = await pool.query(
      `SELECT id, reserva_id, asunto, mensaje, leido, created_at FROM correo WHERE cliente = $1 ORDER BY created_at DESC`,
      [cliente]
    );
    res.json({ data: result.rows });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/correos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM correo WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// â”€â”€â”€ UI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/',                        (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'home.html')));
app.get('/administradores-ui',      (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'administradores.html')));
app.get('/operadores-ui',           (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'operadores.html')));
app.get('/conductores-ui',          (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'conductores.html')));
app.get('/clientes-personales-ui',  (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'clientes-personales.html')));
app.get('/clientes-empresariales-ui', (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'clientes-empresariales.html')));
app.get('/productos-ui',            (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'productos.html')));
app.get('/zonas-geograficas-ui',    (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'zonas-geograficas.html')));
app.get('/categorias-ui',           (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'categorias.html')));
app.get('/correos-ui',              (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'correos.html')));
app.get('/reservas-no-reconocidas-ui', (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'reservas-no-reconocidas.html')));
app.get('/preregistro-empresa-ui',  (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'preregistro-empresa.html')));
app.get('/pagos-ui',                (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'pagos.html')));
app.get('/reservas-ui',             (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'reservas.html')));
app.get('/viajes-ui',               (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'viajes.html')));
app.get('/mis-viajes-ui',           (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'mis-viajes.html')));
app.get('/incidentes-ui',           (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'UI', 'incidentes.html')));
app.get('/metricas',                manejadorMetricas);
app.get('/metricas-ui',             (req, res) => sendHtml(res, path.join(__dirname, 'Shared', 'Metrics', 'metricas.html')));

app.use(manejadorErrores);

ejecutarMigraciones()
  .then(async () => {
    await seedCategorias();
    await ejecutarSeed();
    try { await new RepositorioClientesFrecuentes().actualizarTop20(); } catch { /* error al inicializar top 20 — se reintenta en el siguiente ciclo semanal */ }
    // Recalcular top 20 semanalmente
    setInterval(async () => {
      try { await new RepositorioClientesFrecuentes().actualizarTop20(); } catch { /* fallo transitorio al recalcular top 20 — se reintenta la próxima semana */ }
    }, 7 * 24 * 60 * 60 * 1000);
  })
  .then(() => { app.listen(port); })
  .catch(() => process.exit(1));

