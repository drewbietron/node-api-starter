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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
const v4_1 = __importDefault(require("uuid/v4"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
function saltPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.hash(password, 12);
    });
}
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    createdAt: {
        type: sequelize_1.default.DATE,
        field: "created_at"
    },
    updatedAt: {
        type: sequelize_1.default.DATE,
        field: "updated_at"
    },
    uuid: {
        type: sequelize_1.default.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => v4_1.default(),
        validate: {
            isUUID: 4
        }
    },
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    firstName: {
        type: sequelize_1.default.STRING,
        field: "first_name",
        allowNull: false
    },
    lastName: {
        type: sequelize_1.default.STRING,
        field: "last_name",
        allowNull: false
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 256],
                msg: "Password must be at least 8 charcters"
            }
        }
    }
}, {
    sequelize: database_1.default,
    timestamps: true,
    underscored: true,
    tableName: "users"
});
User.addHook("beforeCreate", (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.changed("password")) {
        user.password = yield saltPassword(user.password);
    }
}));
User.addHook("beforeUpdate", (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.changed("password")) {
        user.password = yield saltPassword(user.password);
    }
}));
exports.default = User;
