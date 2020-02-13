"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../environment"));
const logs_1 = __importDefault(require("./logs"));
new environment_1.default(process.env.NODE_ENV).init();
exports.configOptions = {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    ssl: ["production", "staging"].includes(process.env.NODE_ENV),
    dialectOptions: {
        ssl: ["production", "staging"].includes(process.env.NODE_ENV)
    },
    logging: process.env.DB_LOGS ? logs_1.default : false,
    benchmark: !["production", "staging"].includes(process.env.NODE_ENV)
};
exports.config = {
    url: process.env.DATABASE_URL
};
