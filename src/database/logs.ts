import sqlFormatter from "sql-formatter";
import colors from "colors";
import winston from "winston";

const { splat, combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, meta }) => {
  return `Time (ms) -> ${new Date()
    .getMilliseconds()
    .toPrecision(4)}\nLog Level -> ${level}\n${message}\n${
    meta ? JSON.stringify(meta) : ""
  }`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), splat(), myFormat),
  transports: [new winston.transports.Console()]
});

export default function databaseLogger(message: string) {
  if (message.includes('"users" AS "User"')) return null;

  return logger.info(`${colors.cyan(sqlFormatter.format(message))}\n`);
}
