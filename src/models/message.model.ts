import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "~/types/message.type";

const { ObjectId } = mongoose.Schema.Types;

const messageSchema: Schema = new Schema<IMessage>(
   {
      sender: {
         type: ObjectId,
         ref: 'UserModel',
      },
      message: {
         type: String,
         trim: true,
      },
      conversation: {
         type: ObjectId,
         ref: 'ConversationModel',
      },
      files: [],
   },
   {
      collection: "messages",
      timestamps: true,
   }
);

const MessageModel =
   mongoose.models.MessageModel as mongoose.Model<IMessage> || mongoose.model<IMessage>("MessageModel", messageSchema);

export default MessageModel;