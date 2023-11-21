"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const checkToken_middlewares_1 = require("../middlewares/checkToken.middlewares");
const router = express_1.default.Router();
router.get('/', checkToken_middlewares_1.authMiddlewares, user_controller_1.getUserController);
router.get('/:id', user_controller_1.getUserByIdController);
router.patch('/:id', user_controller_1.updateUserByIdController);
exports.default = router;
