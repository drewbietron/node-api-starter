"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
exports.database = new sequelize_1.Sequelize(config_1.config.url, Object.assign({}, config_1.configOptions));
exports.default = exports.database;
