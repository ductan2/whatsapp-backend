import mongoose from "mongoose";

interface IConversation {
   name: string;
   picture?: string;
   isGroup: boolean;
   users: mongoose.Types.ObjectId[];
   latestMessage?: string | null;
   admin?: mongoose.Types.ObjectId;
}

export default IConversation;