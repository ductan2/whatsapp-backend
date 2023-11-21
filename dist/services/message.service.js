"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const error_type_1 = require("../types/error.type");
class MessageService {
    async getMessageById(id) {
        return await message_model_1.default.findById(id).
            populate("sender", "name avatar email status").populate({
            path: "conversation",
            select: "name is group user",
            model: "ConversationModel",
            populate: {
                path: "users",
                select: "name avatar email status"
            }
        });
    }
    async sendMessage(sender_user, conv_id, message, files) {
        if (!message && !files || !conv_id) {
            throw new error_type_1.ErrorWithStatus({
                message: "Please provider conversation id and message or file!",
                status: 400,
                path: "message"
            });
        }
        const newMessage = await message_model_1.default.create({
            sender: sender_user,
            conversation: conv_id,
            message,
            files
        });
        const getNewMessage = await this.getMessageById(newMessage._id);
        await this.updateLatestMessage(conv_id, getNewMessage);
        return getNewMessage;
    }
    async updateLatestMessage(conv_id, message) {
        return await conversation_model_1.default.updateOne({ _id: conv_id }, { latestMessage: message });
    }
    async getMessageByConversationId(conv_id) {
        const messageList = await message_model_1.default.find({ conversation: conv_id })
            .populate("sender", "name avatar email status").populate("conversation");
        if (!messageList) {
            throw new error_type_1.ErrorWithStatus({
                message: "Message not found!",
                status: 404,
                path: "message"
            });
        }
        return messageList;
    }
}
exports.messageService = new MessageService();
