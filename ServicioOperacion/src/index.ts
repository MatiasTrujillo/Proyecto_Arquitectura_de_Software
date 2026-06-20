import 'dotenv/config';
import express from 'express';
import path from 'path';
import { ControladorVehiculo } from './ModuloVehiculos/WebApi/Controlador/ControladorVehiculo';
import { ControladorDispositivoGPS } from './ModuloVehiculos/WebApi/Controlador/ControladorDispositivoGPS';
import { registradorSolicitudes, manejadorErrores } from './Shared/Logging/requestLogger';
import { manejadorMetricas } from './Shared/Metrics/metrics';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { RepositorioAlerta } from './ModuloVehiculos/DataAccess/RepositorioAlerta';

const app = express();
const port = process.env.PORT || 3000;

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
