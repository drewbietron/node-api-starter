"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const index_1 = __importDefault(require("./routes/index"));
const health_1 = __importDefault(require("./routes/health"));
const authentication_1 = __importDefault(require("./middleware/authentication"));
const app = express_1.default();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") {
    app.use(morgan_1.default("combined"));
}
app.use(errorhandler_1.default());
app.all("*", (req, res, next) => new authentication_1.default({ req, res, next }).authenticate());
app.get("/", index_1.default);
app.get("/_health", health_1.default);
exports.default = app;
