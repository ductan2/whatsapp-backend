import mongoose from "mongoose";
import IConversation from "~/types/conversation.type";
import UserModel from "./user.model";
const ObjectId = mongoose.Schema.Types.ObjectId;

export const conversationSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,
   },
   isGroup: {
      type: Boolean,
      default: false,
   },
   users: [
      {
         type: ObjectId,
         ref: UserModel
      }
   ],
   latestMessage: {
      type: ObjectId,
      ref: "MessageModel"
   },
   admin: {
      type: ObjectId,
      ref: UserModel
   }
}, {
   collection: "conversations", timestamps: true
})
const ConversationModel =
   mongoose.models.ConversationModel as mongoose.Model<IConversation> ||
   mongoose.model<IConversation>("conversation", conversationSchema);

export default ConversationModel
