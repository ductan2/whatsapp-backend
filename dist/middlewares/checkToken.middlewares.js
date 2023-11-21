"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddlewares = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const error_type_1 = require("../types/error.type");
const token_1 = require("../utils/token");
const authMiddlewares = async (req, res, next) => {
    let token;
    if (req?.headers?.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = await (0, token_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
            const expNow = Date.now() / 1000;
            const { exp } = decoded;
            if (Number(exp) < expNow) {
                throw new error_type_1.ErrorWithStatus({
                    message: "Token is expired",
                    status: 401,
                    path: "authMiddlewares"
                });
            }
            const { user_id } = decoded;
            const user = await user_model_1.default.findById(user_id).select('-password');
            req.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    }
    else {
        throw new error_type_1.ErrorWithStatus({
            message: "Token is invalid",
            status: 401,
            path: "authMiddlewares"
        });
    }
};
exports.authMiddlewares = authMiddlewares;
