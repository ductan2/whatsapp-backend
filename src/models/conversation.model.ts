import mongoose, { Schema, Document } from "mongoose";
import IConversation from "~/types/conversation.type";

const { ObjectId } = mongoose.Schema.Types;
const conversationSchema: Schema = new Schema<IConversation>(
   {
      name: {
         type: String,
         required: [true, "Conversations name is required."],
         trim: true,
      },
      picture: {
         type: String,
         default: "https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png",
      },
      isGroup: {
         type: Boolean,
         required: true,
         default: false,
      },
      users: [
         {
            type: ObjectId,
            ref: 'UserModel',
         },
      ],
      latestMessage: {
         type: ObjectId,
         ref: 'MessageModel',
      },
      admin: {
         type: ObjectId,
         ref: 'UserModel',
      },
   },
   {
      collection: "conversations",
      timestamps: true,
   }
);

const ConversationModel =
   mongoose.models.ConversationModel as mongoose.Model<IConversation> ||
   mongoose.model<IConversation>("ConversationModel", conversationSchema);

export default ConversationModel;