"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const passwordSchema = {
    notEmpty: true,
    isLength: {
        options: {
            min: 6,
            max: 50,
        }
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
        },
        errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
    }
};
const confirmPasswordSchema = {
    notEmpty: true,
    isLength: {
        options: {
            min: 6,
            max: 50,
        }
    },
    custom: {
        options: ((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password does not match password!");
            }
            return true;
        })
    }
};
exports.registerValidator = (0, express_validator_1.checkSchema)({
    name: {
        isString: true,
        notEmpty: true,
    },
    email: {
        isString: true,
        notEmpty: true,
        isEmail: true,
        custom: {
            options: async (value, { req }) => {
                const user = await user_model_1.default.findOne({ email: value });
                if (user) {
                    throw new Error("Email is already exist!");
                }
            }
        }
    },
    avatar: {
        optional: true,
        isString: true,
    },
    status: {
        optional: true,
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
});
exports.loginValidator = (0, express_validator_1.checkSchema)({
    email: {
        isString: true,
        notEmpty: true,
        isEmail: true,
        custom: {
            options: async (value, { req }) => {
                const user = await user_model_1.default.findOne({ email: value });
                if (!user) {
                    throw new Error("Email not found!");
                }
            }
        }
    },
    password: passwordSchema,
});
