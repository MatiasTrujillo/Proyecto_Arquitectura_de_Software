import { createLogger, transports, format } from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const registrador = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logsDir, 'errores.log'), level: 'error' }),
    new transports.File({ filename: path.join(logsDir, 'aplicacion.log'), level: 'info' })
  ]
});

export default registrador;
