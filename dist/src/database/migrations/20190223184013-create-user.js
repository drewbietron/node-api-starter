"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
exports.createUser = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.createTable("users", {
                id: {
                    allowNull: false,
                    type: sequelize_1.default.INTEGER,
                    autoIncrement: true
                },
                uuid: {
                    allowNull: false,
                    primaryKey: true,
                    type: sequelize_1.default.UUID
                },
                created_at: {
                    allowNull: false,
                    type: sequelize_1.default.DATE
                },
                updated_at: {
                    allowNull: false,
                    type: sequelize_1.default.DATE
                },
                first_name: {
                    type: sequelize_1.default.STRING
                },
                last_name: {
                    type: sequelize_1.default.STRING
                },
                email: {
                    type: sequelize_1.default.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: sequelize_1.default.STRING
                }
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.dropTable("users")]);
    }
};
exports.default = exports.createUser;
