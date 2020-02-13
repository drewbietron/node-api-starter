"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql_formatter_1 = __importDefault(require("sql-formatter"));
const colors_1 = __importDefault(require("colors"));
const winston_1 = __importDefault(require("winston"));
const { splat, combine, timestamp, printf, colorize } = winston_1.default.format;
const myFormat = printf(({ level, message, meta }) => {
    return `Time (ms) -> ${new Date()
        .getMilliseconds()
        .toPrecision(4)}\nLog Level -> ${level}\n${message}\n${meta ? JSON.stringify(meta) : ""}`;
});
const logger = winston_1.default.createLogger({
    level: "info",
    format: combine(colorize(), timestamp(), splat(), myFormat),
    transports: [new winston_1.default.transports.Console()]
});
function databaseLogger(message) {
    if (message.includes('"users" AS "User"'))
        return null;
    return logger.info(`${colors_1.default.cyan(sql_formatter_1.default.format(message))}\n`);
}
exports.default = databaseLogger;
