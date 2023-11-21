"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const error_type_1 = require("../types/error.type");
class UserService {
    async getUsers(search) {
        const users = await user_model_1.default.find({
            $or: [
                { name: { $regex: search || "", $options: "i" } },
                { email: { $regex: search || "", $options: "i" } }
            ]
        })
            .select("-password")
            .exec();
        return users;
    }
    async getUserById(id) {
        const user = await user_model_1.default.findById(id);
        if (!user)
            throw new error_type_1.ErrorWithStatus({
                message: "User not found",
                status: 404,
                path: "user"
            });
        return user;
    }
    async updateUserById(id, data) {
        await this.getUserById(id);
        const userUpdate = await user_model_1.default.updateOne({ _id: id }, data);
        return userUpdate;
    }
}
const userService = new UserService();
exports.default = userService;
