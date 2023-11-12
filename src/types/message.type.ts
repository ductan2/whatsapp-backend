import mongoose from "mongoose"
export interface IMessage {
   _id: string
   message: string
   sender: mongoose.Types.ObjectId
   conversation: mongoose.Types.ObjectId
   files: any[]
}