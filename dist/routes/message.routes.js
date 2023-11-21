"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const checkToken_middlewares_1 = require("../middlewares/checkToken.middlewares");
const router = express_1.default.Router();
router.post("/", checkToken_middlewares_1.authMiddlewares, message_controller_1.sendMessageController);
router.get("/:conv_id", checkToken_middlewares_1.authMiddlewares, message_controller_1.getMessageController);
exports.default = router;
