import http from 'k6/http';
import { check, sleep } from 'k6';

// F14/R2: 50 conductores enviando ubicación GPS cada 10 segundos en simultáneo
// El sistema debe recibir y verificar que provienen de dispositivos registrados
//
// Cómo correr:
//   k6 run 03-f14-gps-conductores.js
//   k6 run --env DISPOSITIVO_ID=GPS-001 03-f14-gps-conductores.js

const BASE_OPERACION = __ENV.BASE_OPERACION || 'http://localhost:3000';

// Dispositivos GPS de prueba (deben estar registrados en la BD)
// IDs numéricos de dispositivos registrados en la BD
// GPS-001 a GPS-004 son seedeados por defecto en ServicioOperacion (IDs 1-4 en BD limpia)
const DISPOSITIVOS = __ENV.DISPOSITIVO_ID
  ? [__ENV.DISPOSITIVO_ID]
  : ['1', '2', '3', '4'];

export const options = {
  scenarios: {
    conductores_gps: {
      executor: 'constant-vus',
      vus: 50,
      duration: '120s',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed':   ['rate<0.01'],
  },
};

export default function () {
  const dispositivoId = DISPOSITIVOS[(__VU - 1) % DISPOSITIVOS.length];

  const lat = (-34.9 + Math.random() * 0.1).toFixed(6);
  const lng = (-56.2 + Math.random() * 0.1).toFixed(6);

  const body = JSON.stringify({
    dispositivoId,
    lat:       parseFloat(lat),
    lng:       parseFloat(lng),
    velocidad: Math.floor(Math.random() * 80),
  });

  const res = http.post(
    `${BASE_OPERACION}/api/dispositivos/recibir`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'GPS recibido (200/201)': (r) => r.status === 200 || r.status === 201,
  });

  // GPS envía cada ~10 segundos
  sleep(10);
}
