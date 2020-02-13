"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_env_1 = __importDefault(require("custom-env"));
class Environment {
    constructor(nodeEnv = "development") {
        this.nodeEnv = nodeEnv;
    }
    init() {
        return custom_env_1.default.env(this.nodeEnv);
    }
}
exports.default = Environment;
