"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = __importDefault(require("./session"));
exports.authenticatedPaths = ["/authenticated"];
class Authentication {
    constructor(options) {
        this.req = options.req;
        this.res = options.res;
        this.next = options.next;
    }
    authenticate() {
        const session = new session_1.default({ token: this.req.headers.authorization });
        this.res.locals.session = session;
        if (this.authencatedPath(this.req.path)) {
            if (session.validateToken()) {
                return this.handleReturn();
            }
            return this.res.status(401).json();
        }
        return this.handleReturn();
    }
    authencatedPath(path) {
        return exports.authenticatedPaths.some(authPath => {
            return path.startsWith(authPath);
        });
    }
    handleReturn() {
        return this.next();
    }
}
exports.default = Authentication;
