"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationService = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const error_type_1 = require("../types/error.type");
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
class ConversationService {
    async createConversation(sender_id, receiver_id) {
        const receiver_user = await user_model_1.default.findById(receiver_id);
        if (!receiver_user) {
            throw new error_type_1.ErrorWithStatus({
                message: "Receiver user is not found!",
                status: 404,
                path: "conversation"
            });
        }
        let sender_obj_id = new ObjectId(sender_id);
        let receiver_obj_id = new ObjectId(receiver_id);
        const dataRoom = {
            name: receiver_user.name,
            isGroup: false,
            picture: receiver_user.avatar,
            users: [sender_obj_id, receiver_obj_id],
            latestMessage: null,
            admin: sender_obj_id
        };
        const newConversation = await conversation_model_1.default.create(dataRoom);
        const conversation = await conversation_model_1.default.findById(newConversation._id).populate("users", "-password").populate("admin", "-password");
        if (!conversation) {
            throw new Error("Oops... Something went wrong !");
        }
        return conversation;
    }
    async isConversationExisting(sender_id, receiver_id) {
        let conv;
        if (!receiver_id) {
            throw new error_type_1.ErrorWithStatus({
                message: "Receiver id is required!",
                status: 400,
                path: "conversation"
            });
        }
        conv = await conversation_model_1.default.findOne({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: sender_id } } },
                { users: { $elemMatch: { $eq: receiver_id } } },
            ]
        })
            .populate("users", "-password");
        // .populate("latestMessage")
        conv = await user_model_1.default.populate(conv, {
            path: "lastestMessage.sender",
            select: "name email avatar status"
        });
        return conv;
    }
    async getConversation(user_id) {
        const conversations = await conversation_model_1.default.find({
            users: { $elemMatch: { $eq: user_id } }
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        return conversations;
    }
}
exports.conversationService = new ConversationService();
