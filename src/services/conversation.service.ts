import ConversationModel from "~/models/conversation.model";
import UserModel from "~/models/user.model";
import IConversation from "~/types/conversation.type";
import { ErrorWithStatus } from "~/types/error.type";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId


class ConversationService {
   async createConversation(sender_id: string, receiver_id: string) {
      const receiver_user = await UserModel.findById(receiver_id)
      if (!receiver_user) {
         throw new ErrorWithStatus({
            message: "Receiver user is not found!",
            status: 404,
            path: "conversation"
         })
      }
      let sender_obj_id = new ObjectId(sender_id)
      let receiver_obj_id = new ObjectId(receiver_id)
      const dataRoom: IConversation = {
         name: receiver_user.name,
         isGroup: false,
         picture: receiver_user.avatar,
         users: [sender_obj_id, receiver_obj_id],
         latestMessage: null,
         admin: sender_obj_id
      }
      const newConversation = await ConversationModel.create(dataRoom)

      const conversation = await ConversationModel.findById(newConversation._id).populate("users", "-password").populate("admin", "-password")
      if (!conversation) {
         throw new Error("Oops... Something went wrong !")
      }
      return conversation
   }
   async isConversationExisting(sender_id: string, receiver_id: string) {
      let conv;
      if (!receiver_id) {
         throw new ErrorWithStatus({
            message: "Receiver id is required!",
            status: 400,
            path: "conversation"
         })
      }

      conv = await ConversationModel.findOne({
         isGroup: false,
         $and: [
            { users: { $elemMatch: { $eq: sender_id } } },
            { users: { $elemMatch: { $eq: receiver_id } } },
         ]
      })
         .populate("users", "-password")
      // .populate("latestMessage")
      conv = await UserModel.populate(conv, {
         path: "lastestMessage.sender",
         select: "name email avatar status"
      })
      return conv
   }
   async getConversation(user_id: string) {

      const conversations = await ConversationModel.find({
         users: { $elemMatch: { $eq: user_id } }
      })
         .populate("users", "-password")
         .populate("latestMessage")
         .sort({ updatedAt: -1 })
      return conversations
   }
}
export const conversationService = new ConversationService();

