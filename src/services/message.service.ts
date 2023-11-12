
import mongoose from "mongoose";
import ConversationModel from "~/models/conversation.model";
import MessageModel from "~/models/message.model";
import { ErrorWithStatus } from "~/types/error.type";


class MessageService {
   async getMessageById(id: string) {
      return await MessageModel.findById(id).
         populate("sender", "name avatar email status").populate({
            path: "conversation",
            select: "name is group user",
            model: "ConversationModel",
            populate: {
               path: "users",
               select: "name avatar email status"
            }
         })
   }
   async sendMessage(sender_user: string, conv_id: string, message: string, files: any) {
      if (!message && !files || !conv_id) {
         throw new ErrorWithStatus({
            message: "Please provider conversation id and message or file!",
            status: 400,
            path: "message"
         })
      }
      const newMessage = await MessageModel.create({
         sender: sender_user,
         conversation: conv_id,
         message,
      })
      const getNewMessage = await this.getMessageById(newMessage._id)
      await this.updateLatestMessage(conv_id, getNewMessage)
      return getNewMessage
   }
   async updateLatestMessage(conv_id: string, message: any) {
      return await ConversationModel.updateOne({ _id: conv_id }, { latestMessage: message })
   }
   async getMessageByConversationId(conv_id: string) {
      const messageList = await MessageModel.find({ conversation: conv_id })
         .populate("sender", "name avatar email status").populate("conversation")
      console.log("🚀 ~ file: message.service.ts:44 ~ MessageService ~ getMessageByConversationId ~ messageList:", messageList)
      if (!messageList) {
         throw new ErrorWithStatus({
            message: "Message not found!",
            status: 404,
            path: "message"
         })
      }
      return messageList
   }
}
export const messageService = new MessageService();

