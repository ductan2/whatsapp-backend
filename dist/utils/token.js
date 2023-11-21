"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../config/logger"));
const sign = (payload, expiresIn, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, secret, { expiresIn }, (err, token) => {
            if (err) {
                logger_1.default.error(err);
                reject(err);
            }
            else
                resolve(token);
        });
    });
};
exports.sign = sign;
const verify = (token, secret) => {
    return new Promise((resolve, rejcect) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                logger_1.default.error(err);
                rejcect(err);
            }
            else
                resolve(decoded);
        });
    });
};
exports.verify = verify;
