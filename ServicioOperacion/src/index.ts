import 'dotenv/config';
import express from 'express';
import path from 'path';
import { ControladorVehiculo } from './ModuloVehiculos/WebApi/Controlador/ControladorVehiculo';
import { ControladorDispositivoGPS } from './ModuloVehiculos/WebApi/Controlador/ControladorDispositivoGPS';
import { registradorSolicitudes, manejadorErrores } from './Shared/Logging/requestLogger';
import { manejadorMetricas } from './Shared/Metrics/metrics';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { RepositorioAlerta } from './ModuloVehiculos/DataAccess/RepositorioAlerta';
import { RepositorioUbicacionGPS } from './ModuloVehiculos/DataAccess/RepositorioUbicacionGPS';
import { RepositorioVehiculo } from './ModuloVehiculos/DataAccess/RepositorioVehiculo';
import pool from './Shared/Database/DatabaseConnection';

const app = express();
const port = process.env.PORT || 3000;

const simulacionesActivas = new Map<string, ReturnType<typeof setInterval>>();

// Ruta predefinida que atraviesa una zona roja para demostrar las alertas GPS
const RUTA_AUTO_GPS = [
  { lat: -34.9000, lng: -56.1910, velocidad: 40 },
  { lat: -34.9010, lng: -56.1890, velocidad: 38 },
  { lat: -34.9020, lng: -56.1872, velocidad: 35 },
  { lat: -34.9030, lng: -56.1860, velocidad: 32 },
  { lat: -34.9040, lng: -56.1843, velocidad: 25 },
  { lat: -34.9050, lng: -56.1833, velocidad: 20 },
  { lat: -34.9060, lng: -56.1815, velocidad: 28 },
  { lat: -34.9075, lng: -56.1795, velocidad: 38 },
  { lat: -34.9090, lng: -56.1770, velocidad: 42 },
  { lat: -34.9080, lng: -56.1745, velocidad: 40 },
  { lat: -34.9065, lng: -56.1760, velocidad: 36 },
  { lat: -34.9045, lng: -56.1800, velocidad: 32 },
];

const vehiculoController    = new ControladorVehiculo();
const dispositivoController = new ControladorDispositivoGPS();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});
app.use(registradorSolicitudes);

app.post('/api/vehiculos',                    vehiculoController.crearVehiculo);
app.get('/api/vehiculos',                     vehiculoController.obtenerVehiculos);
app.get('/api/vehiculos/matricula/:matricula', vehiculoController.obtenerVehiculoPorMatricula);
app.get('/api/vehiculos/:id',                 vehiculoController.obtenerVehiculoPorId);
app.put('/api/vehiculos/:id',                 vehiculoController.actualizarVehiculo);
app.delete('/api/vehiculos/:id',              vehiculoController.eliminarVehiculo);

app.post('/api/dispositivos',          dispositivoController.crearDispositivoGPS);
app.get('/api/dispositivos',           dispositivoController.obtenerDispositivoGPS);
app.get('/api/dispositivos/disponibles', async (req, res) => {
  try {
    const { excluirMatricula } = req.query;
    let query: string;
    let params: any[];
    if (excluirMatricula) {
      // Al editar: mostrar dispositivos libres + el que ya tiene este vehÃ­culo
      query = `SELECT d.id, d.nombre FROM dispositivo_gps d
               WHERE CAST(d.id AS TEXT) NOT IN (
                 SELECT v.dispositivo_gps FROM vehiculo v
                 WHERE v.dispositivo_gps IS NOT NULL AND v.dispositivo_gps != ''
                   AND v.matricula != $1
               ) ORDER BY d.id`;
      params = [excluirMatricula];
    } else {
      query = `SELECT d.id, d.nombre FROM dispositivo_gps d
               WHERE CAST(d.id AS TEXT) NOT IN (
                 SELECT v.dispositivo_gps FROM vehiculo v
                 WHERE v.dispositivo_gps IS NOT NULL AND v.dispositivo_gps != ''
               ) ORDER BY d.id`;
      params = [];
    }
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
app.post('/api/dispositivos/recibir',                  dispositivoController.recibirInformacion);
app.get('/api/dispositivos/:id',                       dispositivoController.obtenerDispositivoGPSPorId);
app.put('/api/dispositivos/:id',                       dispositivoController.actualizarDispositivoGPS);
app.delete('/api/dispositivos/:id',                    dispositivoController.eliminarDispositivoGPS);
app.get('/api/dispositivos/:dispositivoId/verificar',  dispositivoController.verificarInformacion);

const GESTION_URL = process.env.GESTION_URL || 'http://localhost:3001';

app.get('/api/zonas-rojas', async (_req, res) => {
  try {
    const resp = await fetch(`${GESTION_URL}/internal/zonas-geograficas`);
    if (!resp.ok) { res.status(502).json({ error: 'Error al obtener zonas' }); return; }
    const zonas: any[] = await resp.json();
    const rojas = zonas
      .filter((z: any) => z.tipo === 'roja')
      .map((z: any) => ({ id: z.id, nombre: z.nombre, delimitacion: z.delimitacion }));
    res.json({ data: rojas });
  } catch {
    res.status(503).json({ error: 'ServicioGestion no disponible' });
  }
});

app.get('/api/zonas', async (_req, res) => {
  try {
    const resp = await fetch(`${GESTION_URL}/internal/zonas-geograficas`);
    if (!resp.ok) { res.status(502).json({ error: 'Error al obtener zonas' }); return; }
    const zonas: any[] = await resp.json();
    res.json({ data: zonas.map((z: any) => ({ id: z.id, nombre: z.nombre, tipo: z.tipo, delimitacion: z.delimitacion })) });
  } catch {
    res.status(503).json({ error: 'ServicioGestion no disponible' });
  }
});

app.post('/internal/simular-gps/iniciar', async (req, res) => {
  const { vehiculoMatricula } = req.body;
  if (!vehiculoMatricula) { res.status(400).json({ error: 'vehiculoMatricula requerido' }); return; }

  if (simulacionesActivas.has(vehiculoMatricula)) {
    res.json({ mensaje: 'SimulaciÃ³n ya activa para este vehÃ­culo' });
    return;
  }

  let dispositivoId: number | null = null;
  try {
    const repo = new RepositorioVehiculo();
    const vehiculo = await repo.obtenerPorMatricula(vehiculoMatricula);
    const gpsStr = vehiculo?.obtenerDispositivoGps();
    if (gpsStr) dispositivoId = Number(gpsStr);
  } catch {
    // si el vehículo no existe la matrícula queda null
  }

  if (!dispositivoId || isNaN(dispositivoId)) {
    try {
      const r = await pool.query('SELECT id FROM dispositivo_gps ORDER BY id LIMIT 1');
      dispositivoId = r.rows[0]?.id ?? null;
    } catch {
      // si no hay dispositivos registrados la simulación no inicia
    }
  }

  if (!dispositivoId) {
    res.status(404).json({ error: 'No hay dispositivo GPS disponible para simular' });
    return;
  }

  let lectura = 0;
  const devId = dispositivoId;

  const enviarTick = async () => {
    const punto = RUTA_AUTO_GPS[lectura % RUTA_AUTO_GPS.length];
    lectura++;
    try {
      await fetch(`http://localhost:${port}/api/dispositivos/recibir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispositivoId: devId, vehiculoMatricula, ...punto }),
      });
    } catch {
      // si el endpoint GPS no está disponible se reintenta en el siguiente tick
    }
  };

  enviarTick();
  const intervalo = setInterval(enviarTick, 10000);
  simulacionesActivas.set(vehiculoMatricula, intervalo);
  res.json({ mensaje: `SimulaciÃ³n GPS iniciada para ${vehiculoMatricula}`, dispositivoId: devId });
});

app.post('/internal/simular-gps/detener', (req, res) => {
  const { vehiculoMatricula } = req.body;
  if (!vehiculoMatricula) { res.status(400).json({ error: 'vehiculoMatricula requerido' }); return; }

  const intervalo = simulacionesActivas.get(vehiculoMatricula);
  if (intervalo) {
    clearInterval(intervalo);
    simulacionesActivas.delete(vehiculoMatricula);
    res.json({ mensaje: `SimulaciÃ³n GPS detenida para ${vehiculoMatricula}` });
  } else {
    res.json({ mensaje: 'No habÃ­a simulaciÃ³n activa para este vehÃ­culo' });
  }
});

app.get('/api/ubicaciones/ultima', async (req, res) => {
  try {
    const { vehiculo } = req.query;
    if (!vehiculo) { res.status(400).json({ error: 'ParÃ¡metro vehiculo requerido' }); return; }
    const repo = new RepositorioUbicacionGPS();
    const pos = await repo.obtenerUltimaByMatricula(String(vehiculo));
    res.json({ data: pos });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/proxy/viajes-en-curso', async (req, res) => {
  try {
    const params = new URLSearchParams();
    if (req.query.vehiculo)     params.append('vehiculo',     String(req.query.vehiculo));
    if (req.query.conductor)    params.append('conductor',    String(req.query.conductor));
    if (req.query.categoria)    params.append('categoria',    String(req.query.categoria));
    if (req.query.tieneAlertas) params.append('tieneAlertas', String(req.query.tieneAlertas));
    const qs = params.toString();
    const resp = await fetch(`${GESTION_URL}/internal/viajes/en-curso${qs ? '?' + qs : ''}`);
    if (!resp.ok) { res.status(502).json({ error: 'Error al obtener viajes' }); return; }
    const viajes = await resp.json();
    res.json({ data: viajes });
  } catch {
    res.status(503).json({ error: 'ServicioGestion no disponible' });
  }
});

app.get('/api/alertas', async (req, res) => {
  try {
    const { vehiculo } = req.query;
    const repo = new RepositorioAlerta();
    if (vehiculo) {
      const alertas = await repo.obtenerPorVehiculo(String(vehiculo));
      res.json({ data: alertas });
    } else {
      res.status(400).json({ error: 'ParÃ¡metro vehiculo requerido' });
    }
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/',                  (_req, res) => res.sendFile(path.join(__dirname, 'Shared', 'UI', 'home.html')));
app.get('/vehiculos-ui',      (_req, res) => res.sendFile(path.join(__dirname, 'Shared', 'UI', 'vehiculos.html')));
app.get('/dispositivos-ui',   (_req, res) => res.sendFile(path.join(__dirname, 'Shared', 'UI', 'dispositivos.html')));
app.get('/simulacion-gps-ui', (_req, res) => res.sendFile(path.join(__dirname, 'Shared', 'UI', 'simulacion-gps.html')));
app.get('/traslados-ui',      (_req, res) => res.sendFile(path.join(__dirname, 'Shared', 'UI', 'traslados.html')));
app.get('/metricas',          manejadorMetricas);
app.get('/metricas-ui',       (_req, res) => res.sendFile(path.join(__dirname, 'Shared', 'UI', 'metricas.html')));

app.use(manejadorErrores);

ejecutarMigraciones()
  .then(() => { app.listen(port); })
  .catch(() => process.exit(1));

