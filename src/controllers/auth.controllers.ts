import { NextFunction, Request, Response } from "express"
import * as core from "express-serve-static-core";
import { authService } from "~/services/auth.service";
import { AuthType, LoginType } from "~/types/auth.type";

export const registerController = async (req: Request<core.ParamsDictionary, any, AuthType>, res: Response, next: NextFunction) => {
   const { email, name, password, confirm_password } = req.body;
   try {
      await authService.register({ email, name, password, confirm_password })

      return res.json({
         message: "Register success!",
      })
   } catch (error) {
      next(error)
   }
}
export const loginController = async (req: Request<core.ParamsDictionary, any, LoginType>, res: Response, next: NextFunction) => {
   const { email, password } = req.body;
   try {
      const { token, user, refresh_token } = await authService.login({ email, password })
      res.cookie("refresh_token", refresh_token, {
         httpOnly: true,
         path: "/api/v1/auth/refreshToken",
         maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      return res.json({
         message: "Login success!",
         result: {
            access_token: token,
            user
         }
      })
   } catch (error) {
      next(error)
   }
}
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      res.clearCookie("refresh_token", { path: "/api/v1/auth/refreshToken" })
      res.json({
         message: "Logout success!"
      })
   } catch (error) {
      next(error)
   }
}
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const refresh_token = req.cookies.refresh_token
      const result = await authService.refreshToken(refresh_token)
      return res.json({
         message: "Get token by refresh_token success!",
         result
      })
   } catch (error) {
      next(error)
   }
}

export const getInfoController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = req.user
      return res.json({
         message: "Get info success!",
         result: user
      })
   } catch (error) {
      next(error)
   }
}