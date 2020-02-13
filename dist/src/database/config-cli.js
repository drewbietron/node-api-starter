"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../environment"));
new environment_1.default(process.env.NODE_ENV).init();
module.exports = {
    [process.env.NODE_ENV]: {
        url: process.env.DATABASE_URL,
        dialect: "postgres",
        ssl: ["production", "staging"].includes(process.env.NODE_ENV),
        dialectOptions: {
            ssl: ["production", "staging"].includes(process.env.NODE_ENV)
        }
    }
};
console.log(`CLI is using ${process.env.DATABASE_URL} in NODE_ENV=${process.env.NODE_ENV}`);
