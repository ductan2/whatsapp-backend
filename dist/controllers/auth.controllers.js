"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfoController = exports.refreshTokenController = exports.logoutController = exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("../services/auth.service");
const registerController = async (req, res, next) => {
    const { email, name, password, confirm_password } = req.body;
    try {
        await auth_service_1.authService.register({ email, name, password, confirm_password });
        return res.json({
            message: "Register success!",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerController = registerController;
const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const { token, user, refresh_token } = await auth_service_1.authService.login({ email, password });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refreshToken",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.json({
            message: "Login success!",
            result: {
                access_token: token,
                user
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginController = loginController;
const logoutController = async (req, res, next) => {
    try {
        res.clearCookie("refresh_token", { path: "/api/v1/auth/refreshToken" });
        res.json({
            message: "Logout success!"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
const refreshTokenController = async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const result = await auth_service_1.authService.refreshToken(refresh_token);
        return res.json({
            message: "Get token by refresh_token success!",
            result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshTokenController = refreshTokenController;
const getInfoController = async (req, res, next) => {
    try {
        const user = req.user;
        return res.json({
            message: "Get info success!",
            result: user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInfoController = getInfoController;
