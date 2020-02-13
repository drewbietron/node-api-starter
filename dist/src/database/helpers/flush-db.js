"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
function flushDb() {
    if (process.env.NODE_ENV === 'production')
        return;
    database_1.default.drop()
        .then(() => {
        database_1.default.sync({ force: true });
    })
        .then(() => {
        console.log('FLUSHED THE DB');
        process.exit();
    });
}
exports.default = flushDb;
flushDb();
