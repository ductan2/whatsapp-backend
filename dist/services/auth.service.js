"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const error_type_1 = require("../types/error.type");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../utils/token");
class AuthService {
    async hassPassword(password) {
        password = await bcrypt_1.default.hash(password, 10);
        return password;
    }
    async comparePassword(password, hash) {
        const isMatch = await bcrypt_1.default.compare(password, hash);
        return isMatch;
    }
    async generateToken(user_id, expiresIn = "1d", secret) {
        const token = await (0, token_1.sign)({ user_id }, expiresIn, secret);
        return token;
    }
    async register(body) {
        const isEmail = await user_model_1.default.findOne({ email: body.email });
        if (isEmail) {
            throw new error_type_1.ErrorWithStatus({
                message: "Email is already exist!",
                status: 400,
                path: "email"
            });
        }
        const user = await user_model_1.default.create({
            ...body,
            password: await this.hassPassword(body.password)
        });
        return user;
    }
    async login(body) {
        const user = await user_model_1.default.findOne({ email: body.email });
        if (!user) {
            throw new error_type_1.ErrorWithStatus({
                message: "Email is not found!",
                status: 404,
                path: "email"
            });
        }
        const isMatch = await this.comparePassword(body.password, user.password);
        if (!isMatch) {
            throw new error_type_1.ErrorWithStatus({
                message: "Password does not match!",
                status: 401,
                path: "password"
            });
        }
        const token = await this.generateToken(user._id.toString(), "1d", process.env.ACCESS_TOKEN_SECRET);
        const refresh_token = await this.generateToken(user._id.toString(), "7d", process.env.REFRESH_TOKEN_SECRET);
        return {
            token,
            refresh_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                status: user.status,
                avatar: user.avatar,
            },
        };
    }
    async refreshToken(refresh_token) {
        if (!refresh_token)
            throw new error_type_1.ErrorWithStatus({
                message: "Refresh token is required. Please login!",
                status: 400,
                path: "refresh_token"
            });
        const jwtDecode = await (0, token_1.verify)(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const { user_id } = jwtDecode;
        const user = await user_model_1.default.findById(user_id).select("-password");
        return {
            token: await this.generateToken(user_id, "1d", process.env.ACCESS_TOKEN_SECRET),
            user,
        };
    }
}
exports.authService = new AuthService();
