import express from "express"
import { createConversationController, getConversationController } from "~/controllers/conversation.controller"
import { authMiddlewares } from "~/middlewares/checkToken.middlewares"

const router = express.Router()

router.post("/", authMiddlewares, createConversationController)

router.get('/',authMiddlewares,getConversationController)
export default router