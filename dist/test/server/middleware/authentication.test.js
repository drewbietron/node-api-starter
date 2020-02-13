"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("jest-express/lib/request");
const response_1 = require("jest-express/lib/response");
const user_1 = __importDefault(require("../../fabricators/user"));
const session_1 = __importDefault(require("../../../src/server/middleware/session"));
const authentication_1 = __importStar(require("../../../src/server/middleware/authentication"));
describe("authentication middleware", () => {
    function mockResponse() {
        return new response_1.Response();
    }
    function mockRequest(route = "/", overrides) {
        return new request_1.Request(route, Object.assign({}, overrides));
    }
    describe("with a valid token", () => {
        it("sets res.locals.session to the user session", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default();
            const token = yield new session_1.default({ user }).generateToken();
            const req = mockRequest("/", {
                headers: { authorization: token }
            });
            const res = mockResponse();
            const next = jest.fn();
            new authentication_1.default({ req, res, next }).authenticate();
            expect(res.locals.session).toEqual(new session_1.default({ token }));
        }));
        describe("auth paths", () => {
            it("returns early if its not an auth path", () => __awaiter(void 0, void 0, void 0, function* () {
                return authentication_1.authenticatedPaths.forEach(() => {
                    const req = mockRequest("/_health", {
                        headers: { authorization: null }
                    });
                    const res = mockResponse();
                    const next = jest.fn();
                    new authentication_1.default({ req, res, next }).authenticate();
                    expect(next).toHaveBeenCalled();
                });
            }));
            it("only cares about authenticating the auth paths", () => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield user_1.default();
                const token = yield new session_1.default({ user }).generateToken();
                return authentication_1.authenticatedPaths.forEach(() => {
                    const req = mockRequest("/", {
                        headers: { authorization: token }
                    });
                    const res = mockResponse();
                    const next = jest.fn();
                    new authentication_1.default({ req, res, next }).authenticate();
                    expect(next).toHaveBeenCalled();
                });
            }));
        });
    });
    describe("with an invalid token", () => {
        it("sets res.locals.session to the user session", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest("/authenticated", {
                headers: { authorization: null }
            });
            const res = mockResponse();
            const next = jest.fn();
            new authentication_1.default({ req, res, next }).authenticate();
            expect(res.status).toHaveBeenCalledWith(401);
        }));
        it("only cares about authenticating the auth paths", () => __awaiter(void 0, void 0, void 0, function* () {
            return authentication_1.authenticatedPaths.forEach(() => {
                const req = mockRequest("/authenticated", {
                    headers: { authorization: null }
                });
                const res = mockResponse();
                const next = jest.fn();
                new authentication_1.default({ req, res, next }).authenticate();
                expect(res.status).toHaveBeenCalledWith(401);
            });
        }));
    });
});
