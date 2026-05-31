# 📚 Guía de Configuración de PostgreSQL

## ¿Qué hemos hecho?

Hemos integrado PostgreSQL en tu proyecto de forma segura y escalable. Aquí está todo configurado:

### 1️⃣ **Archivo `.env`** 
- Contiene las credenciales de la base de datos
- **NUNCA** sube este archivo a Git (está en `.gitignore`)
- Formato: `DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos`

### 2️⃣ **Conexión centralizada** (`src/Shared/Database/DatabaseConnection.ts`)
- Crea un único "Pool" de conexiones (reutilizables)
- Se importa en todos los repositorios
- Evita duplicar código

### 3️⃣ **Migraciones SQL** (`src/Shared/Database/migrations/`)
- Scripts que crean/modifican la estructura de las tablas
- Ejecutadas automáticamente cuando inicias el app
- Versión controlada (podés ver el historial de cambios)

### 4️⃣ **Script de migraciones** (`src/Shared/Database/MigracionesRunner.ts`)
- Ejecuta automáticamente todos los `.sql`
- Usado por el script `npm run db:migrate`

---

## 🚀 Cómo usar

### Paso 1: Iniciar Docker (base de datos)
```bash
docker-compose up -d
```
Esto inicia PostgreSQL en `localhost:5432`

### Paso 2: Ejecutar migraciones
```bash
npm run db:migrate
```
Esto crea la tabla `administrador` y prepara la BD

### Paso 3: Usar el repositorio
Ya está listo para usar `RepositorioAdministrador` con PostgreSQL ✅

---

## 📊 Estructura de datos

### Tabla `administrador`
```
┌─────────┬─────────────┬────────┬───────────┬────────────┐
│   id    │   cedula    │ nombre │ created_at│ updated_at │
├─────────┼─────────────┼────────┼───────────┼────────────┤
│  int    │  varchar    │ varchar│ timestamp │ timestamp  │
│ PRIMARY │   UNIQUE    │ NOT NULL           │            │
└─────────┴─────────────┴────────┴───────────┴────────────┘
```

---

## ⚙️ Variables de entorno disponibles

Puedes editar `.env` para cambiar:
- `DATABASE_URL`: Cadena de conexión a PostgreSQL
- `NODE_ENV`: `development` o `production`

---

## 🆘 Solución de problemas

### Error: "Cannot connect to database"
1. Verifica que Docker está corriendo: `docker ps`
2. Verifica la contraseña en `.env` coincide con `docker-compose.yml`
3. Espera 5 segundos después de `docker-compose up`

### Error: "permission denied" en .env
Windows: Click derecho en `.env` → Propiedades → Seguridad

---

## 📝 Próximos pasos

Cuando agregues más módulos:
1. Crea un nuevo archivo `.sql` en `src/Shared/Database/migrations/`
2. Ejecuta `npm run db:migrate` 
3. Crea el repositorio correspondiente
4. Importa el pool centralizado
