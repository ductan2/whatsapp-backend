import { NextFunction, Request, Response } from "express";
import { conversationService } from "~/services/conversation.service";

export const createConversationController = async (req: Request, res: Response, next: NextFunction) => {
   const { receiver_id } = req.body
   const { _id: sender_id } = req.user
   if (receiver_id === sender_id) {
      return res.status(400).json({
         message: "You cannot create conversation with yourself"
      })
   }
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
   const { _id: user_id } = req.user;
   try {
      const result = await conversationService.getConversation(user_id)
      return res.json(result)
   } catch (error) {
      next(error)
   }
}