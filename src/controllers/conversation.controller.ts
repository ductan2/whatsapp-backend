import { NextFunction, Request, Response } from "express";
import { conversationService } from "~/services/conversation.service";

export const createConversationController = async (req: Request, res: Response, next: NextFunction) => {
   const { receiver_id } = req.body
   const { _id: sender_id } = req.user
   try {
      const isConversationExisting = await conversationService.isConversationExisting(sender_id.toString(), receiver_id)
      if (isConversationExisting) {
         return res.json(isConversationExisting)
      }
      else {
         const newConversation = await conversationService.createConversation(sender_id.toString(), receiver_id)
         return res.json(newConversation)
      }
   } catch (error) {
      next(error)
   }
}
export const getConversationController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      
   } catch (error) {
      next(error)
   }
}