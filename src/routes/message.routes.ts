import express from "express"
import { getMessageController, sendMessageController } from "~/controllers/message.controller"
import { authMiddlewares } from "~/middlewares/checkToken.middlewares"

const router = express.Router()


router.post("/", authMiddlewares, sendMessageController)

router.get("/:conv_id", authMiddlewares, getMessageController)

export default router