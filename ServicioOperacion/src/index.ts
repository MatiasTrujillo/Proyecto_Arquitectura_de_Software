import express from 'express';
import path from 'path';
import { ControladorVehiculo } from './ModuloVehiculos/WebApi/Controlador/ControladorVehiculo';
import { ControladorDispositivoGPS } from './ModuloVehiculos/WebApi/Controlador/ControladorDispositivoGPS';
import { registradorSolicitudes, manejadorErrores } from './Shared/Logging/requestLogger';
import { manejadorMetricas } from './Shared/Metrics/metrics';

const app = express();
const port = process.env.PORT || 3000;

const vehiculoController = new ControladorVehiculo();
const dispositivoController = new ControladorDispositivoGPS();

app.use(express.json());
app.use(registradorSolicitudes);

app.post('/api/vehiculos', vehiculoController.crearVehiculo.bind(vehiculoController));
app.get('/api/vehiculos', vehiculoController.obtenerVehiculos.bind(vehiculoController));
app.get('/api/vehiculos/:id', vehiculoController.obtenerVehiculoPorId.bind(vehiculoController));
app.put('/api/vehiculos/:id', vehiculoController.actualizarVehiculo.bind(vehiculoController));
app.delete('/api/vehiculos/:id', vehiculoController.eliminarVehiculo.bind(vehiculoController));

app.post('/api/dispositivos', dispositivoController.crearDispositivoGPS.bind(dispositivoController));
app.get('/api/dispositivos', dispositivoController.obtenerDispositivoGPS.bind(dispositivoController));
app.get('/api/dispositivos/:id', dispositivoController.obtenerDispositivoGPSPorId.bind(dispositivoController));
app.put('/api/dispositivos/:id', dispositivoController.actualizarDispositivoGPS.bind(dispositivoController));
app.delete('/api/dispositivos/:id', dispositivoController.eliminarDispositivoGPS.bind(dispositivoController));
app.post('/api/dispositivos/recibir', dispositivoController.recibirInformacion.bind(dispositivoController));
app.get('/api/dispositivos/:dispositivoId/verificar', dispositivoController.verificarInformacion.bind(dispositivoController));

app.get('/', (req, res) => {
  res.send('ServicioOperacion activo. Usa /metricas o /api/vehiculos');
});

app.get('/metricas', manejadorMetricas);
app.get('/metricas-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'Shared', 'Metrics', 'metricas.html'));
});
app.use(manejadorErrores);

app.listen(port, () => {
  console.log(`ServicioOperacion escuchando en http://localhost:${port}`);
});
