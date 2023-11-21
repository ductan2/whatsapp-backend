"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversation_controller_1 = require("../controllers/conversation.controller");
const checkToken_middlewares_1 = require("../middlewares/checkToken.middlewares");
const router = express_1.default.Router();
router.post("/", checkToken_middlewares_1.authMiddlewares, conversation_controller_1.createConversationController);
router.get('/', checkToken_middlewares_1.authMiddlewares, conversation_controller_1.getConversationController);
exports.default = router;
