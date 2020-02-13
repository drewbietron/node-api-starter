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
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = __importDefault(require("../../../src/server/middleware/session"));
const user_1 = __importDefault(require("../../fabricators/user"));
const user_2 = __importDefault(require("../../../src/database/models/user"));
describe("SessionToken", () => {
    describe("generateToken", () => {
        it("returns a jwt token", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default();
            const token = yield new session_1.default({ user }).generateToken();
            expect(token).toBeDefined();
        }));
    });
    describe("validateToken", () => {
        it("validates a jwt token", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default();
            const token = yield new session_1.default({ user }).generateToken();
            const isValidToken = yield new session_1.default({ user, token }).validateToken();
            expect(isValidToken).not.toBeNull();
        }));
        it("returns the user information", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default();
            const token = yield new session_1.default({ user }).generateToken();
            const isValidToken = yield new session_1.default({ user, token }).validateToken();
            const returnedUser = yield user_2.default.findByPk(isValidToken.data);
            expect(returnedUser.uuid).toBe(user.uuid);
        }));
    });
    describe("currentUser", () => {
        it("returns the current user", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default();
            const token = yield new session_1.default({ user }).generateToken();
            const currentUser = yield new session_1.default({ token }).currentUser();
            expect(user.uuid).toEqual(currentUser.uuid);
        }));
    });
});
