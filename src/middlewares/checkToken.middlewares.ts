import { NextFunction, Request, Response } from "express"
import UserModel from "~/models/user.model"
import { JwtType } from "~/types/auth.type"
import { ErrorWithStatus } from "~/types/error.type"
import { verify } from "~/utils/token"

export const authMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
   let token
   if (req?.headers?.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
      try {
         const decoded = await verify(token, process.env.ACCESS_TOKEN_SECRET as string)
         const expNow = Date.now() / 1000;
         const { exp } = decoded as JwtType;
         if (Number(exp) < expNow) {
            throw new ErrorWithStatus({
               message: "Token is expired",
               status: 401,
               path: "authMiddlewares"
            })
         }
         const { user_id } = decoded as JwtType
         const user = await UserModel.findById(user_id).select('-password')
         req.user = user
         next()
      } catch (error) {
         next(error)
      }
   }
   else {
      throw new ErrorWithStatus({
         message: "Token is invalid",
         status: 401,
         path: "authMiddlewares"
      })
   }
}