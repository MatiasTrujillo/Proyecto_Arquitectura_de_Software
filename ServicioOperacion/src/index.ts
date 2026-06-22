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

// Auto-simulación GPS por vehículo (se activa al iniciar traslado)
const simulacionesActivas = new Map<string, ReturnType<typeof setInterval>>();
const RUTA_AUTO_GPS = [
  { lat: -34.9000, lng: -56.1910, velocidad: 40 },
  { lat: -34.9010, lng: -56.1890, velocidad: 38 },
  { lat: -34.9020, lng: -56.1872, velocidad: 35 },
  { lat: -34.9030, lng: -56.1860, velocidad: 32 }, // entra a zona roja
  { lat: -34.9040, lng: -56.1843, velocidad: 25 }, // dentro zona roja
  { lat: -34.9050, lng: -56.1833, velocidad: 20 }, // dentro zona roja
  { lat: -34.9060, lng: -56.1815, velocidad: 28 }, // sale de zona roja
  { lat: -34.9075, lng: -56.1795, velocidad: 38 },
  { lat: -34.9090, lng: -56.1770, velocidad: 42 },
  { lat: -34.9080, lng: -56.1745, velocidad: 40 },
  { lat: -34.9065, lng: -56.1760, velocidad: 36 },
  { lat: -34.9045, lng: -56.1800, velocidad: 32 },
];

const vehiculoController = new ControladorVehiculo();
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

app.post('/api/vehiculos', vehiculoController.crearVehiculo.bind(vehiculoController));
app.get('/api/vehiculos', vehiculoController.obtenerVehiculos.bind(vehiculoController));
app.get('/api/vehiculos/matricula/:matricula', vehiculoController.obtenerVehiculoPorMatricula.bind(vehiculoController));
app.get('/api/vehiculos/:id', vehiculoController.obtenerVehiculoPorId.bind(vehiculoController));
app.put('/api/vehiculos/:id', vehiculoController.actualizarVehiculo.bind(vehiculoController));
app.delete('/api/vehiculos/:id', vehiculoController.eliminarVehiculo.bind(vehiculoController));

app.post('/api/dispositivos', dispositivoController.crearDispositivoGPS.bind(dispositivoController));
app.get('/api/dispositivos', dispositivoController.obtenerDispositivoGPS.bind(dispositivoController));
// Dispositivos no asignados a ningún vehículo (para el dropdown al crear/editar vehículo)
app.get('/api/dispositivos/disponibles', async (req, res) => {
  try {
    const { excluirMatricula } = req.query;
    let query: string;
    let params: any[];
    if (excluirMatricula) {
      // Al editar: mostrar dispositivos libres + el que ya tiene este vehículo
      query = `SELECT d.id, d.nombre FROM dispositivo_gps d
               WHERE CAST(d.id AS TEXT) NOT IN (
                 SELECT v.dispositivo_gps FROM vehiculo v
                 WHERE v.dispositivo_gps IS NOT NULL AND v.dispositivo_gps != ''
                   AND v.matricula != $1
               ) ORDER BY d.id`;
      params = [excluirMatricula];
    } else {
      // Al crear: solo dispositivos sin vehículo asignado
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
app.post('/api/dispositivos/recibir', dispositivoController.recibirInformacion.bind(dispositivoController));
app.get('/api/dispositivos/:id', dispositivoController.obtenerDispositivoGPSPorId.bind(dispositivoController));
app.put('/api/dispositivos/:id', dispositivoController.actualizarDispositivoGPS.bind(dispositivoController));
app.delete('/api/dispositivos/:id', dispositivoController.eliminarDispositivoGPS.bind(dispositivoController));
app.get('/api/dispositivos/:dispositivoId/verificar', dispositivoController.verificarInformacion.bind(dispositivoController));

// Proxy: zonas rojas reales desde ServicioGestion (para la simulación UI)
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

// Iniciar auto-simulación GPS cuando el conductor inicia un traslado
app.post('/internal/simular-gps/iniciar', async (req, res) => {
  const { vehiculoMatricula } = req.body;
  if (!vehiculoMatricula) { res.status(400).json({ error: 'vehiculoMatricula requerido' }); return; }

  if (simulacionesActivas.has(vehiculoMatricula)) {
    res.json({ mensaje: 'Simulación ya activa para este vehículo' });
    return;
  }

  // Obtener dispositivo GPS asociado al vehículo
  let dispositivoId: number | null = null;
  try {
    const repo = new RepositorioVehiculo();
    const vehiculo = await repo.obtenerPorMatricula(vehiculoMatricula);
    const gpsStr = vehiculo?.getDispositivoGps();
    if (gpsStr) dispositivoId = Number(gpsStr);
  } catch {}

  // Fallback: primer dispositivo disponible
  if (!dispositivoId || isNaN(dispositivoId)) {
    try {
      const r = await pool.query('SELECT id FROM dispositivo_gps ORDER BY id LIMIT 1');
      dispositivoId = r.rows[0]?.id ?? null;
    } catch {}
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
    } catch {}
  };

  enviarTick(); // primera posición inmediata
  const intervalo = setInterval(enviarTick, 10000);
  simulacionesActivas.set(vehiculoMatricula, intervalo);
  res.json({ mensaje: `Simulación GPS iniciada para ${vehiculoMatricula}`, dispositivoId: devId });
});

// Detener auto-simulación GPS cuando el conductor finaliza el traslado
app.post('/internal/simular-gps/detener', (req, res) => {
  const { vehiculoMatricula } = req.body;
  if (!vehiculoMatricula) { res.status(400).json({ error: 'vehiculoMatricula requerido' }); return; }

  const intervalo = simulacionesActivas.get(vehiculoMatricula);
  if (intervalo) {
    clearInterval(intervalo);
    simulacionesActivas.delete(vehiculoMatricula);
    res.json({ mensaje: `Simulación GPS detenida para ${vehiculoMatricula}` });
  } else {
    res.json({ mensaje: 'No había simulación activa para este vehículo' });
  }
});

// Última posición GPS por matrícula de vehículo (para el mapa de monitoreo)
app.get('/api/ubicaciones/ultima', async (req, res) => {
  try {
    const { vehiculo } = req.query;
    if (!vehiculo) { res.status(400).json({ error: 'Parámetro vehiculo requerido' }); return; }
    const repo = new RepositorioUbicacionGPS();
    const pos = await repo.obtenerUltimaByMatricula(String(vehiculo));
    res.json({ data: pos });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Proxy: viajes en curso desde ServicioGestion (para el mapa de monitoreo del operador)
app.get('/api/proxy/viajes-en-curso', async (req, res) => {
  try {
    const resp = await fetch(`${GESTION_URL}/internal/viajes/en-curso`);
    if (!resp.ok) { res.status(502).json({ error: 'Error al obtener viajes' }); return; }
    const viajes = await resp.json();
    res.json({ data: viajes });
  } catch {
    res.status(503).json({ error: 'ServicioGestion no disponible' });
  }
});

// F16: Consulta de alertas generadas
app.get('/api/alertas', async (req, res) => {
  try {
    const { vehiculo } = req.query;
    const repo = new RepositorioAlerta();
    if (vehiculo) {
      const alertas = await repo.obtenerPorVehiculo(String(vehiculo));
      res.json({ data: alertas });
    } else {
      res.status(400).json({ error: 'Parámetro vehiculo requerido' });
    }
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'home.html'));
});
app.get('/vehiculos-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'vehiculos.html'));
});
app.get('/dispositivos-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'dispositivos.html'));
});
app.get('/simulacion-gps-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'simulacion-gps.html'));
});
app.get('/traslados-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'traslados.html'));
});

app.get('/metricas', manejadorMetricas);
app.get('/metricas-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'UI', 'metricas.html'));
});
app.use(manejadorErrores);

ejecutarMigraciones()
  .then(() => {
    app.listen(port, () => {
      console.log(`ServicioOperacion escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar ServicioOperacion:', err);
    process.exit(1);
  });
