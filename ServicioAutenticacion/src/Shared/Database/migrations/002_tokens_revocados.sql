-- JWT usa tokens sin estado (stateless): no se guarda la sesión activa en DB.
-- Solo se guarda el token cuando el usuario hace logout (lista negra/blacklist).
-- Al verificar: primero se valida la firma JWT, luego se chequea si fue revocado.

DROP TABLE IF EXISTS sesiones CASCADE;

CREATE TABLE IF NOT EXISTS tokens_revocados (
  token       TEXT        PRIMARY KEY,
  cedula      VARCHAR(30) NOT NULL,
  revocado_en TIMESTAMP   NOT NULL DEFAULT NOW(),
  expira_en   TIMESTAMP   NOT NULL
);
