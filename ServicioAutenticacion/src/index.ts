import express from 'express';
import dotenv from 'dotenv';
import { ControladorAuth } from './WebApi/ControladorAuth';
import ejecutarMigraciones from './Shared/Database/MigracionesRunner';
import { ejecutarSeed } from './Shared/Database/SeedRunner';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

const controlador = new ControladorAuth();

app.use(express.json());

// ─── Rutas de autenticación ───────────────────────────────────────────────────
app.post('/api/auth/registrar',        controlador.registrar.bind(controlador));
app.post('/api/auth/registrar-interno', controlador.registrarInterno.bind(controlador));
app.post('/api/auth/login',     controlador.login.bind(controlador));
app.post('/api/auth/logout',    controlador.logout.bind(controlador));
app.get('/api/auth/verificar',  controlador.verificar.bind(controlador));

// ─── Página de inicio ─────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ServicioAutenticacion</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
    h1 { margin-top: 0; color: #333; }
    .nav { display: flex; gap: 10px; margin: 20px 0; }
    .nav button { padding: 10px 20px; border: 2px solid #0066cc; border-radius: 4px; background: white; color: #0066cc; cursor: pointer; font-size: 1em; }
    .nav button:hover { background: #e8f0ff; }
    .nav button.activo { background: #0066cc; color: white; }
    .seccion { display: none; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 20px; max-width: 400px; }
    .seccion.visible { display: block; }
    h2 { margin-top: 0; color: #444; }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input, select { width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .btn-accion { padding: 9px 18px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 14px; font-size: 1em; }
    .btn-accion:hover { background: #0052a3; }
    .resultado { padding: 10px; border-radius: 4px; margin-top: 14px; font-family: monospace; white-space: pre-wrap; font-size: 0.9em; display: none; }
    .ok { background: #e8f4e8; border-left: 4px solid #1a7a1a; }
    .err { background: #fde8e8; border-left: 4px solid #cc0000; }
    .token-guardado { background: #e8f4e8; border: 1px solid #aad4aa; border-radius: 4px; padding: 10px; margin-top: 12px; font-family: monospace; font-size: 0.85em; display: none; word-break: break-all; }
  </style>
</head>
<body>
  <h1>ServicioAutenticacion</h1>
  <p>Puerto <strong>3002</strong> &mdash; Servicio externo de autenticación</p>

  <div class="nav">
    <button onclick="mostrarSeccion('registrar')" id="btn-registrar">Registrar</button>
    <button onclick="mostrarSeccion('login')" id="btn-login">Login</button>
    <button onclick="mostrarSeccion('logout')" id="btn-logout">Logout</button>
  </div>

  <div id="sec-registrar" class="seccion">
    <h2>Crear cuenta</h2>
    <label>Cédula</label>
    <input type="text" id="regCedula" placeholder="Ej: 12345678">
    <label>Nombre completo</label>
    <input type="text" id="regNombre" placeholder="Ej: Juan Pérez">
    <label>Password</label>
    <input type="password" id="regPassword" placeholder="Contraseña">
    <label>Tipo de cuenta</label>
    <select id="regRol">
      <option value="ClientePersonal">Cliente Personal</option>
      <option value="ClienteEmpresa">Cliente Empresa</option>
    </select>
    <button class="btn-accion" onclick="registrar()">Crear cuenta</button>
    <div id="resRegistrar" class="resultado"></div>
  </div>

  <div id="sec-login" class="seccion">
    <h2>Login</h2>
    <label>Cédula</label>
    <input type="text" id="loginCedula" placeholder="Ej: 12345678">
    <label>Password</label>
    <input type="password" id="loginPassword" placeholder="Contraseña">
    <button class="btn-accion" onclick="login()">Iniciar sesión</button>
    <div id="resLogin" class="resultado"></div>
    <div id="tokenGuardado" class="token-guardado">Token: <span id="tokenValor"></span></div>
  </div>

  <div id="sec-logout" class="seccion">
    <h2>Logout</h2>
    <label>Token</label>
    <input type="text" id="logoutToken" placeholder="UUID del token">
    <button class="btn-accion" onclick="logout()">Cerrar sesión</button>
    <div id="resLogout" class="resultado"></div>
  </div>

  <script>
    function mostrarSeccion(nombre) {
      ['registrar','login','logout'].forEach(s => {
        document.getElementById('sec-' + s).classList.remove('visible');
        document.getElementById('btn-' + s).classList.remove('activo');
      });
      document.getElementById('sec-' + nombre).classList.add('visible');
      document.getElementById('btn-' + nombre).classList.add('activo');
    }

    function mostrar(id, datos, ok) {
      const el = document.getElementById(id);
      el.textContent = JSON.stringify(datos, null, 2);
      el.className = 'resultado ' + (ok ? 'ok' : 'err');
      el.style.display = 'block';
    }

    async function registrar() {
      const cedula   = document.getElementById('regCedula').value;
      const nombre   = document.getElementById('regNombre').value;
      const password = document.getElementById('regPassword').value;
      const rol      = document.getElementById('regRol').value;
      if (!cedula || !nombre || !password) {
        mostrar('resRegistrar', { error: 'Todos los campos son obligatorios' }, false);
        return;
      }
      try {
        const res = await fetch('/api/auth/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cedula, nombre, password, rol })
        });
        mostrar('resRegistrar', await res.json(), res.ok);
      } catch (e) { mostrar('resRegistrar', { error: e.message }, false); }
    }

    async function login() {
      const cedula = document.getElementById('loginCedula').value;
      const password = document.getElementById('loginPassword').value;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cedula, password })
        });
        const json = await res.json();
        if (res.ok && json.token) {
          const paginas = {
            'Administrador':   'http://localhost:3001/',
            'Operador':        'http://localhost:3001/operadores-ui',
            'Conductor':       'http://localhost:3001/conductores-ui',
            'ClientePersonal': 'http://localhost:3001/clientes-personales-ui',
            'ClienteEmpresa':  'http://localhost:3001/clientes-empresariales-ui',
          };
          const destino = paginas[json.rol];
          if (destino) {
            window.location.href = destino + '?token=' + encodeURIComponent(json.token) + '&rol=' + encodeURIComponent(json.rol);
          } else {
            mostrar('resLogin', { error: 'Rol sin página asignada: ' + json.rol }, false);
          }
        } else {
          mostrar('resLogin', json, false);
        }
      } catch (e) { mostrar('resLogin', { error: e.message }, false); }
    }

    async function logout() {
      const token = document.getElementById('logoutToken').value;
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        mostrar('resLogout', await res.json(), res.ok);
      } catch (e) { mostrar('resLogout', { error: e.message }, false); }
    }
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
