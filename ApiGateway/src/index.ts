import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 8080;

const GESTION_URL   = process.env.GESTION_URL   || 'http://localhost:3001';
const OPERACION_URL = process.env.OPERACION_URL  || 'http://localhost:3000';

// Rutas de ServicioOperacion: /operacion/* → http://localhost:3000/*
app.use('/operacion', createProxyMiddleware({
  target: OPERACION_URL,
  changeOrigin: true,
  pathRewrite: { '^/operacion': '' },
}));

// Todo lo demás → ServicioGestion
app.use('/', createProxyMiddleware({
  target: GESTION_URL,
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`API Gateway escuchando en http://localhost:${PORT}`);
  console.log(`  /operacion/* → ${OPERACION_URL}`);
  console.log(`  /*           → ${GESTION_URL}`);
});
