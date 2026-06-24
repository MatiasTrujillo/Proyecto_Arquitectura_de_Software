// El usuario admin se crea en Auth0 via Management API al primer arranque.
// Cédula: admin | Email: admin@move.internal | Rol: Administrador
// La contraseña se configura en .env como ADMIN_PASSWORD
// (debe cumplir la política de Auth0: 8+ chars, mayúscula, número, ej: Admin123!)

const AUTH0_DOMAIN        = process.env.AUTH0_DOMAIN        || '';
const AUTH0_CLIENT_ID     = process.env.AUTH0_CLIENT_ID     || '';
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || '';
const ADMIN_CEDULA        = process.env.ADMIN_CEDULA        || 'admin';
const ADMIN_PASSWORD      = process.env.ADMIN_PASSWORD      || 'Admin123!';
const ADMIN_EMAIL         = `${ADMIN_CEDULA}@move.internal`;

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

export async function ejecutarSeed(): Promise<void> {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) {
    console.log('[seed] Variables AUTH0_* no configuradas — omitiendo seed de admin');
    return;
  }

  try {
    const token = await obtenerTokenManagement();

    // Verificar si ya existe
    const searchRes = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(ADMIN_EMAIL)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const usuarios: any[] = await searchRes.json();

    if (Array.isArray(usuarios) && usuarios.length > 0) {
      console.log(`[seed] Admin ya existe en Auth0 (${ADMIN_EMAIL})`);
      return;
    }

    // Crear admin en Auth0
    const createRes = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        connection:    'Username-Password-Authentication',
        email:         ADMIN_EMAIL,
        password:      ADMIN_PASSWORD,
        user_metadata: { cedula: ADMIN_CEDULA, rol: 'Administrador' },
      }),
    });

    if (createRes.ok) {
      console.log(`[seed] Admin creado en Auth0 — email: "${ADMIN_EMAIL}", cedula: "${ADMIN_CEDULA}"`);
    } else {
      const err: any = await createRes.json();
      console.warn(`[seed] No se pudo crear admin en Auth0: ${err.message}`);
    }
  } catch (e) {
    console.warn('[seed] Error al conectar con Auth0 Management API:', String(e));
  }
}
