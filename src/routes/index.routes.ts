import express from 'express';
import authRouter from './auth.routes';
import conversationRouter from './conversation.routes';
const router = express.Router();


router.use('/auth', authRouter)
router.use('/conversation', conversationRouter)

export default router;