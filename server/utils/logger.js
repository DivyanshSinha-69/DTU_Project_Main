import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Hardcoded path to root (one level up from utils)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../logs'); // Always goes up one level to root

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formatter for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Daily rotating transport for user actions
const userActionTransport = new DailyRotateFile({
  filename: path.join(logDir, "user-actions-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  level: "info",
});

// Daily rotating transport for errors
const errorTransport = new DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  level: "error",
});

// Loggers
const userActionLogger = winston.createLogger({
  format: logFormat,
  transports: [userActionTransport],
});

const errorLogger = winston.createLogger({
  format: logFormat,
  transports: [errorTransport],
});

export { userActionLogger, errorLogger };