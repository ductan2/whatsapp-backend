import { NextFunction, Request, Response } from "express";
import { messageService } from "~/services/message.service";
export const sendMessageController = async (req: Request, res: Response, next: NextFunction) => {
   const { _id: sender_user } = req.user
   const { conv_id, message, files } = req.body
   try {
      const result = await messageService.sendMessage(sender_user, conv_id, message, files)
      res.status(200).json(result)
   } catch (error) {
      next(error)
   }
}
export const getMessageController = async (req: Request, res: Response, next: NextFunction) => {
   const { conv_id } = req.params
   try {
      const result = await messageService.getMessageByConversationId(conv_id)
      return res.status(200).json(result)
   } catch (error) {
      next(error)
   }
}