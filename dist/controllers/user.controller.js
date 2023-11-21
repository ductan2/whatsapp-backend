"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserByIdController = exports.getUserByIdController = exports.getUserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const getUserController = async (req, res, next) => {
    try {
        const search = req.query.search;
        const result = await user_service_1.default.getUsers(search);
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserController = getUserController;
const getUserByIdController = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await user_service_1.default.getUserById(id);
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserByIdController = getUserByIdController;
const updateUserByIdController = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, avatar, password } = req.body;
        const result = await user_service_1.default.updateUserById(id, { name, avatar, password });
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserByIdController = updateUserByIdController;
