import http from 'k6/http';
import { check, sleep } from 'k6';

// R1: Crear reservas de clientes empresa
// - Top 20 clientes frecuentes: clasificar y dejar lista para pago en < 600ms
// - Clientes no frecuentes: en 700-1000ms
// - Carga esperada: 100 reservas/min
//
// Cómo correr:
//   k6 run 01-r1-reservas-empresa.js
//   k6 run --env CEDULA_EMPRESA=12345678 01-r1-reservas-empresa.js

const BASE_AUTH    = __ENV.BASE_AUTH    || 'http://localhost:3002';
const BASE_GESTION = __ENV.BASE_GESTION || 'http://localhost:3001';

// Simula 100 reservas/min: 20 VUs frecuentes + 80 VUs no frecuentes
export const options = {
  scenarios: {
    clientes_frecuentes: {
      executor: 'constant-vus',
      vus: 20,
      duration: '60s',
      tags: { tipo: 'frecuente' },
    },
    clientes_no_frecuentes: {
      executor: 'constant-vus',
      vus: 80,
      duration: '60s',
      startTime: '65s',
      tags: { tipo: 'no_frecuente' },
    },
  },
  thresholds: {
    'http_req_duration{tipo:frecuente}':    ['p(95)<600'],
    'http_req_duration{tipo:no_frecuente}': ['p(95)<1000'],
    'http_req_failed':                      ['rate<0.01'],
  },
};

export function setup() {
  const resEmpresa = http.post(
    `${BASE_AUTH}/api/auth/token-test`,
    JSON.stringify({ cedula: __ENV.CEDULA_EMPRESA || 'empresa-carga-1', rol: 'ClienteEmpresa' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (resEmpresa.status !== 200) {
    throw new Error(`No se pudo obtener token de prueba: ${resEmpresa.body}`);
  }
  return { token: resEmpresa.json('token') };
}

export default function (data) {
  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${data.token}`,
  };

  const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const body = JSON.stringify({
    origen:  'Av. 18 de Julio 1000',
    destino: 'Av. Italia 3000',
    fecha:   manana,
    bienes:  [{ productoId: 1, descripcion: 'Producto de prueba de carga', valor: 100, tamano: 1, categorias: [] }],
  });

  const res = http.post(`${BASE_GESTION}/api/clientes-empresariales/realizar-reserva`, body, { headers });

  check(res, {
    'reserva creada (201)': (r) => r.status === 201,
    'tiene id':             (r) => r.json('data') !== null,
  });

  sleep(0.6);
}
