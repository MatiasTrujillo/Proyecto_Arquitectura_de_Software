const AUTH0_DOMAIN        = process.env.AUTH0_DOMAIN        || '';
const AUTH0_CLIENT_ID     = process.env.AUTH0_CLIENT_ID     || '';
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || '';
const ADMIN_EMAIL         = process.env.ADMIN_EMAIL         || 'admin@move.internal';
const ADMIN_PASSWORD      = process.env.ADMIN_PASSWORD      || 'Admin123!';
const ADMIN_CEDULA        = ADMIN_EMAIL.split('@')[0];

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
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) return;

  try {
    const token = await obtenerTokenManagement();

    const searchRes = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(ADMIN_EMAIL)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const usuarios: any[] = await searchRes.json();
    if (Array.isArray(usuarios) && usuarios.length > 0) return;

    await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        connection:    'Username-Password-Authentication',
        email:         ADMIN_EMAIL,
        password:      ADMIN_PASSWORD,
        user_metadata: { cedula: ADMIN_CEDULA, rol: 'Administrador' },
      }),
    });
  } catch {
    // Auth0 no disponible al arrancar — admin puede crearse manualmente
  }
}
