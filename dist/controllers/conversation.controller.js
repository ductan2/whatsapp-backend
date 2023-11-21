"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationController = exports.createConversationController = void 0;
const conversation_service_1 = require("../services/conversation.service");
const createConversationController = async (req, res, next) => {
    const { receiver_id } = req.body;
    const { _id: sender_id } = req.user;
    if (receiver_id === sender_id) {
        return res.status(400).json({
            message: "You cannot create conversation with yourself"
        });
    }
    try {
        const isConversationExisting = await conversation_service_1.conversationService.isConversationExisting(sender_id.toString(), receiver_id);
        if (isConversationExisting) {
            return res.json(isConversationExisting);
        }
        else {
            const newConversation = await conversation_service_1.conversationService.createConversation(sender_id.toString(), receiver_id);
            return res.json(newConversation);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createConversationController = createConversationController;
const getConversationController = async (req, res, next) => {
    const { _id: user_id } = req.user;
    try {
        const result = await conversation_service_1.conversationService.getConversation(user_id);
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getConversationController = getConversationController;
