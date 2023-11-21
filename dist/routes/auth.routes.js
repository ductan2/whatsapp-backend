"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const checkToken_middlewares_1 = require("../middlewares/checkToken.middlewares");
const validator_1 = require("../utils/validator");
const router = express_1.default.Router();
router.post('/register', (0, validator_1.validate)(auth_middlewares_1.registerValidator), auth_controllers_1.registerController);
router.post('/login', (0, validator_1.validate)(auth_middlewares_1.loginValidator), auth_controllers_1.loginController);
router.get('/logout', auth_controllers_1.logoutController);
router.post('/refreshToken', auth_controllers_1.refreshTokenController);
router.get('/info', checkToken_middlewares_1.authMiddlewares, auth_controllers_1.getInfoController);
exports.default = router;
