"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./server/config"));
const server = config_1.default.listen(config_1.default.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", config_1.default.get("port"), config_1.default.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
exports.default = server;
