import express from "express"
import { getUserByIdController, getUserController, updateUserByIdController } from "~/controllers/user.controller"
import { authMiddlewares } from "~/middlewares/checkToken.middlewares"
const router = express.Router()

router.get('/', authMiddlewares, getUserController)

router.get('/:id', getUserByIdController)

router.patch('/:id', updateUserByIdController)

export default router