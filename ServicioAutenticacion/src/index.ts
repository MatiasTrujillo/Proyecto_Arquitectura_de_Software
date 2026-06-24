import 'dotenv/config';
import express from 'express';
import { ControladorAuth } from './WebApi/ControladorAuth';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { ejecutarSeed } from './Shared/Database/SeedRunner';

const app = express();
const port = process.env.PORT || 3002;

const controlador = new ControladorAuth();

app.use(express.json());

// ─── Rutas de autenticación ───────────────────────────────────────────────────
app.post('/api/auth/registrar',         controlador.registrar.bind(controlador));
app.post('/api/auth/registrar-interno', controlador.registrarInterno.bind(controlador));
app.post('/api/auth/logout',            controlador.logout.bind(controlador));
app.get('/api/auth/verificar',          controlador.verificar.bind(controlador));

// ─── OAuth 2.0 con Auth0 ─────────────────────────────────────────────────────
app.get('/api/auth/oauth/iniciar', controlador.iniciarOAuth.bind(controlador));
app.get('/api/auth/callback',      controlador.callbackOAuth.bind(controlador));

// ─── Página de inicio ─────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MOVE – Autenticación</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 40px 20px; background: #f5f5f5; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .card { background: white; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.1); padding: 36px 32px; width: 100%; max-width: 420px; }
    h1 { margin: 0 0 6px; font-size: 1.6em; color: #222; }
    .subtitulo { color: #777; font-size: 0.9em; margin: 0 0 28px; }
    .btn-oauth { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 13px; background: #eb5424; color: white; text-decoration: none; border-radius: 6px; font-size: 1em; font-weight: bold; transition: background .2s; }
    .btn-oauth:hover { background: #c94010; }
    .divisor { display: flex; align-items: center; gap: 12px; margin: 22px 0; color: #aaa; font-size: 0.85em; }
    .divisor::before, .divisor::after { content: ''; flex: 1; border-top: 1px solid #ddd; }
    .nav { display: flex; gap: 8px; margin-bottom: 18px; }
    .nav button { flex: 1; padding: 9px; border: 2px solid #0066cc; border-radius: 4px; background: white; color: #0066cc; cursor: pointer; font-size: 0.9em; transition: background .15s; }
    .nav button:hover { background: #e8f0ff; }
    .nav button.activo { background: #0066cc; color: white; }
    .seccion { display: none; }
    .seccion.visible { display: block; }
    label { display: block; margin-top: 12px; font-size: 0.85em; font-weight: bold; color: #444; }
    input, select { width: 100%; padding: 9px 10px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95em; }
    input:focus, select:focus { outline: none; border-color: #0066cc; }
    .btn-accion { width: 100%; padding: 11px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 16px; font-size: 1em; font-weight: bold; }
    .btn-accion:hover { background: #0052a3; }
    .resultado { padding: 10px 12px; border-radius: 4px; margin-top: 14px; font-family: monospace; white-space: pre-wrap; font-size: 0.85em; display: none; }
    .ok  { background: #eafaea; border-left: 4px solid #1a8a1a; }
    .err { background: #fde8e8; border-left: 4px solid #cc0000; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MOVE</h1>
    <p class="subtitulo">Plataforma de movilidad empresarial</p>

    <a href="/api/auth/oauth/iniciar" class="btn-oauth">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      Iniciar sesión con Auth0
    </a>

    <div class="divisor">¿Primera vez? Registrate</div>

    <div class="nav">
      <button onclick="mostrar('registrar')" id="btn-registrar">Crear cuenta</button>
      <button onclick="mostrar('logout')"    id="btn-logout">Cerrar sesión</button>
    </div>

    <div id="sec-registrar" class="seccion">
      <label>Cédula</label>
      <input type="text" id="regCedula" placeholder="Ej: 12345678">
      <label>Nombre completo</label>
      <input type="text" id="regNombre" placeholder="Ej: Juan Pérez">
      <label>Email</label>
      <input type="email" id="regEmail" placeholder="Ej: juan@ejemplo.com">
      <label>Contraseña</label>
      <input type="password" id="regPassword" placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número">
      <label>Tipo de cuenta</label>
      <select id="regRol">
        <option value="ClientePersonal">Cliente Personal</option>
        <option value="ClienteEmpresa">Cliente Empresa</option>
      </select>
      <button class="btn-accion" onclick="registrar()">Crear cuenta</button>
      <div id="resRegistrar" class="resultado"></div>
    </div>

    <div id="sec-logout" class="seccion">
      <label>Token de sesión</label>
      <input type="text" id="logoutToken" placeholder="Pegá el token JWT aquí">
      <button class="btn-accion" onclick="cerrarSesion()">Cerrar sesión</button>
      <div id="resLogout" class="resultado"></div>
    </div>
  </div>

  <script>
    function mostrar(nombre) {
      ['registrar','logout'].forEach(s => {
        document.getElementById('sec-' + s).classList.remove('visible');
        document.getElementById('btn-' + s).classList.remove('activo');
      });
      document.getElementById('sec-' + nombre).classList.add('visible');
      document.getElementById('btn-' + nombre).classList.add('activo');
    }

    function mostrarRes(id, datos, ok) {
      const el = document.getElementById(id);
      el.textContent = typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2);
      el.className = 'resultado ' + (ok ? 'ok' : 'err');
      el.style.display = 'block';
    }

    async function registrar() {
      const cedula   = document.getElementById('regCedula').value.trim();
      const nombre   = document.getElementById('regNombre').value.trim();
      const email    = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const rol      = document.getElementById('regRol').value;
      if (!cedula || !nombre || !email || !password) {
        mostrarRes('resRegistrar', { error: 'Todos los campos son obligatorios' }, false);
        return;
      }
      try {
        const res = await fetch('/api/auth/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cedula, nombre, email, password, rol })
        });
        const json = await res.json();
        mostrarRes('resRegistrar', json, res.ok);
        if (res.ok) mostrarRes('resRegistrar', 'Cuenta creada. Ya podés iniciar sesión con Auth0 usando tu email: ' + email, true);
      } catch (e) { mostrarRes('resRegistrar', { error: e.message }, false); }
    }

    async function cerrarSesion() {
      const token = document.getElementById('logoutToken').value.trim();
      if (!token) { mostrarRes('resLogout', { error: 'Ingresá el token' }, false); return; }
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        mostrarRes('resLogout', await res.json(), res.ok);
      } catch (e) { mostrarRes('resLogout', { error: e.message }, false); }
    }

    // Auto-abrir registro si viene con ?modo=registrar
    if (new URLSearchParams(location.search).get('modo') === 'registrar') mostrar('registrar');
  </script>
</body>
</html>`);
});

ejecutarMigraciones()
  .then(() => ejecutarSeed())
  .then(() => {
    app.listen(port, () => {
      console.log(`ServicioAutenticacion escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar ServicioAutenticacion:', err);
    process.exit(1);
  });
