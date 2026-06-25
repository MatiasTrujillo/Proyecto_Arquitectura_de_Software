import http from 'k6/http';
import { check, sleep } from 'k6';

// R8: Soportar hasta 50x la carga normal
// Escenario de rampa creciente para determinar el punto de quiebre
// Carga base: 100 reservas/min → carga máxima: 5000 reservas/min
//
// Cómo correr:
//   k6 run 04-r8-alta-demanda.js

const BASE_AUTH      = __ENV.BASE_AUTH      || 'http://localhost:3002';
const BASE_GESTION   = __ENV.BASE_GESTION   || 'http://localhost:3001';
const BASE_OPERACION = __ENV.BASE_OPERACION || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 10  },   // 1x  carga base (calentamiento)
    { duration: '60s', target: 50  },   // 5x
    { duration: '60s', target: 100 },   // 10x
    { duration: '60s', target: 250 },   // 25x
    { duration: '60s', target: 500 },   // 50x (carga máxima R8)
    { duration: '30s', target: 0   },   // bajada gradual
  ],
  thresholds: {
    'http_req_duration': ['p(95)<5000'],  // stress test: tolera hasta 5s a 50x carga
    'http_req_failed':   ['rate<0.05'],
  },
};

export function setup() {
  const res = http.post(
    `${BASE_AUTH}/api/auth/token-test`,
    JSON.stringify({ cedula: __ENV.CEDULA_EMPRESA || 'empresa-carga-1', rol: 'ClienteEmpresa' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (res.status !== 200) {
    throw new Error(`No se pudo obtener token de prueba: ${res.body}`);
  }
  return { token: res.json('token') };
}

export default function (data) {
  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${data.token}`,
  };

  const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Mezcla de operaciones para simular carga real
  const operacion = __VU % 3;

  if (operacion === 0) {
    // Crear reserva
    const res = http.post(
      `${BASE_GESTION}/api/clientes-empresariales/realizar-reserva`,
      JSON.stringify({
        origen:  'Av. 18 de Julio 1000',
        destino: 'Av. Italia 3000',
        fecha:   manana,
        bienes:  [{ productoId: 1, descripcion: 'Carga alta demanda', valor: 100, tamano: 1, categorias: [] }],
      }),
      { headers }
    );
    check(res, { 'reserva OK': (r) => r.status === 201 || r.status === 400 });
  } else if (operacion === 1) {
    // Consultar mis reservas (paginado)
    const res = http.get(
      `${BASE_GESTION}/api/clientes-empresariales/me/reservas?limit=20&page=1`,
      { headers }
    );
    check(res, { 'consulta OK': (r) => r.status === 200 });
  } else {
    // Consultar vehículos disponibles (lista pequeña, sin auth)
    const res = http.get(`${BASE_OPERACION}/api/vehiculos`);
    check(res, { 'vehículos OK': (r) => r.status === 200 });
  }

  sleep(0.1);
}
