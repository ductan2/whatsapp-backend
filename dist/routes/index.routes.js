"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const conversation_routes_1 = __importDefault(require("./conversation.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const router = express_1.default.Router();
router.use('/auth', auth_routes_1.default);
router.use('/user', user_routes_1.default);
router.use('/conversation', conversation_routes_1.default);
router.use("/message", message_routes_1.default);
exports.default = router;
