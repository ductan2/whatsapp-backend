import express from 'express';
import { getInfoController, loginController, logoutController, refreshTokenController, registerController } from '~/controllers/auth.controllers';
import { loginValidator, registerValidator } from '~/middlewares/auth.middlewares';
import { authMiddlewares } from '~/middlewares/checkToken.middlewares';
import { validate } from '~/utils/validator';
const router = express.Router();


router.post('/register', validate(registerValidator), registerController)

router.post('/login', validate(loginValidator), loginController)

router.get('/logout', logoutController)

router.post('/refreshToken', refreshTokenController)

router.get('/info', authMiddlewares, getInfoController)



export default router;