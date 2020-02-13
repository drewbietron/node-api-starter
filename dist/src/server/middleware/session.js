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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../database/models/user"));
class Session {
    constructor(options) {
        this.options = options;
    }
    generateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.sign({
                    data: this.options.user.uuid
                }, process.env.JWT_SECRET, { expiresIn: "1y" });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    validateToken() {
        try {
            return jsonwebtoken_1.default.verify(this.formattedToken, process.env.JWT_SECRET);
        }
        catch (_a) {
            return false;
        }
    }
    currentUser(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUuid = uuid || this.validateToken().data;
            if (userUuid) {
                try {
                    return yield user_1.default.findByPk(userUuid, {
                        attributes: {
                            exclude: ["password"]
                        }
                    });
                }
                catch (_a) {
                    return null;
                }
            }
            return null;
        });
    }
    get formattedToken() {
        if (this.options.token.startsWith("Bearer")) {
            return this.options.token.replace("Bearer", "").trim();
        }
        return this.options.token;
    }
}
exports.default = Session;
