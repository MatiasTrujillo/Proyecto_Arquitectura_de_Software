import http from 'k6/http';
import { check, sleep } from 'k6';

// R2: Consultas y listados bajo carga
// - Consultas/reportes: < 300ms
// - Listados: < 500ms
// - Condición: 100 reservas/min + 50 conductores en simultáneo
//
// Cómo correr:
//   k6 run 02-r2-consultas.js

const BASE_AUTH      = __ENV.BASE_AUTH      || 'http://localhost:3002';
const BASE_GESTION   = __ENV.BASE_GESTION   || 'http://localhost:3001';
const BASE_OPERACION = __ENV.BASE_OPERACION || 'http://localhost:3000';

export const options = {
  scenarios: {
    consultas: {
      executor: 'constant-vus',
      vus: 50,
      duration: '60s',
    },
  },
  thresholds: {
    'http_req_duration{tipo:consulta}': ['p(95)<300'],
    'http_req_duration{tipo:listado}':  ['p(95)<500'],
    'http_req_failed':                  ['rate<0.01'],
  },
};

export function setup() {
  const resAdmin = http.post(
    `${BASE_AUTH}/api/auth/token-test`,
    JSON.stringify({ cedula: 'admin', rol: 'Administrador' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  const resCliente = http.post(
    `${BASE_AUTH}/api/auth/token-test`,
    JSON.stringify({ cedula: __ENV.CEDULA_EMPRESA || 'empresa-carga-1', rol: 'ClienteEmpresa' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (resAdmin.status !== 200 || resCliente.status !== 200) {
    throw new Error('No se pudo obtener token de prueba');
  }
  return {
    tokenAdmin:   resAdmin.json('token'),
    tokenCliente: resCliente.json('token'),
  };
}

const HOY = new Date().toISOString().split('T')[0];

export default function (data) {
  const headersAdmin   = { 'Authorization': `Bearer ${data.tokenAdmin}` };
  const headersCliente = { 'Authorization': `Bearer ${data.tokenCliente}` };

  // Consultas individuales (< 300ms) — con filtro de fecha para simular uso real
  const resReservas = http.get(
    `${BASE_GESTION}/api/clientes-empresariales/me/reservas?fechaDesde=${HOY}&fechaHasta=${HOY}`,
    { headers: headersCliente, tags: { tipo: 'consulta' } }
  );
  check(resReservas, { 'mis reservas OK': (r) => r.status === 200 });

  const resCategorias = http.get(
    `${BASE_GESTION}/api/categorias`,
    { headers: headersAdmin, tags: { tipo: 'consulta' } }
  );
  check(resCategorias, { 'categorías OK': (r) => r.status === 200 });

  // Listados (< 500ms)
  const resVehiculos = http.get(
    `${BASE_OPERACION}/api/vehiculos`,
    { tags: { tipo: 'listado' } }
  );
  check(resVehiculos, { 'vehículos OK': (r) => r.status === 200 });

  const resViajes = http.get(
    `${BASE_GESTION}/api/viajes/en-curso`,
    { headers: headersAdmin, tags: { tipo: 'listado' } }
  );
  check(resViajes, { 'viajes en curso OK': (r) => r.status === 200 });

  sleep(0.5);
}
