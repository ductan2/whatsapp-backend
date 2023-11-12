import mongoose from "mongoose";

interface IConversation {
   _id?: string
   name: string;
   picture?: string;
   isGroup: boolean;
   users: mongoose.Types.ObjectId[];
   latestMessage?: string | null;
   admin?: mongoose.Types.ObjectId;
}
export interface LatestMessage {
   _id: string;
   sender: mongoose.Types.ObjectId;
   message: string;
   conversation: mongoose.Types.ObjectId;
   files: any[]; 
}
export default IConversation;