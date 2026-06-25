const AUTH0_DOMAIN        = process.env.AUTH0_DOMAIN        || '';
const AUTH0_CLIENT_ID     = process.env.AUTH0_CLIENT_ID     || '';
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || '';

const SEED_USUARIOS = [
  { cedula: 'admin',      email: process.env.ADMIN_EMAIL    || 'admin@move.internal', password: process.env.ADMIN_PASSWORD || 'Admin123!', rol: 'Administrador' },
  { cedula: 'conductor1', email: 'conductor1@move.internal', password: 'Conductor1!', rol: 'Conductor' },
  { cedula: 'conductor2', email: 'conductor2@move.internal', password: 'Conductor2!', rol: 'Conductor' },
  { cedula: 'conductor3', email: 'conductor3@move.internal', password: 'Conductor3!', rol: 'Conductor' },
  { cedula: 'conductor4', email: 'conductor4@move.internal', password: 'Conductor4!', rol: 'Conductor' },
  { cedula: 'operador1',  email: 'operador1@move.internal',  password: 'Operador1!',  rol: 'Operador'  },
  { cedula: 'operador2',  email: 'operador2@move.internal',  password: 'Operador2!',  rol: 'Operador'  },
];

async function obtenerTokenManagement(): Promise<string> {
  const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type:    'client_credentials',
      client_id:     AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience:      `https://${AUTH0_DOMAIN}/api/v2/`,
    }),
  });
  const data: any = await res.json();
  if (!data.access_token) throw new Error(`Management API token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sincronizarUsuario(token: string, usuario: typeof SEED_USUARIOS[0]): Promise<void> {
  const searchRes = await fetch(
    `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(usuario.email)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const existentes: any[] = await searchRes.json();

  if (Array.isArray(existentes) && existentes.length > 0) {
    // Usuario ya existe → actualizar contraseña para que coincida con el seed
    const userId = existentes[0].user_id;
    await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: usuario.password, connection: 'Username-Password-Authentication' }),
    });
    return;
  }

  await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      connection:    'Username-Password-Authentication',
      email:         usuario.email,
      password:      usuario.password,
      user_metadata: { cedula: usuario.cedula, rol: usuario.rol },
    }),
  });
}

export async function ejecutarSeed(): Promise<void> {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) return;

  try {
    const token = await obtenerTokenManagement();
    for (const usuario of SEED_USUARIOS) {
      await sincronizarUsuario(token, usuario);
    }
  } catch {
    // Auth0 no disponible al arrancar — usuarios pueden crearse manualmente
  }
}
