import express from 'express';
import authRouter from './auth.routes';
import conversationRouter from './conversation.routes';
import messageRouter from './message.routes';
import userRouter from './user.routes';
const router = express.Router();


router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/conversation', conversationRouter)
router.use("/message", messageRouter)

export default router;