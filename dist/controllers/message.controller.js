"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageController = exports.sendMessageController = void 0;
const message_service_1 = require("../services/message.service");
const sendMessageController = async (req, res, next) => {
    const { _id: sender_user } = req.user;
    const { conv_id, message, files } = req.body;
    try {
        const result = await message_service_1.messageService.sendMessage(sender_user, conv_id, message, files);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.sendMessageController = sendMessageController;
const getMessageController = async (req, res, next) => {
    const { conv_id } = req.params;
    try {
        const result = await message_service_1.messageService.getMessageByConversationId(conv_id);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getMessageController = getMessageController;
