import { NextFunction, Request, Response } from "express"
import * as core from "express-serve-static-core";
import userService from "~/services/user.service";
import { UpdateType } from "~/types/auth.type";
export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const search = req.query.search as string
      const result = await userService.getUsers(search)
      return res.json(result)
   } catch (error) {
      next(error)
   }
}
export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const id = req.params.id
      const result = await userService.getUserById(id)
      return res.json(result)
   } catch (error) {
      next(error)
   }
}
export const updateUserByIdController = async (req: Request<core.ParamsDictionary, any, UpdateType>, res: Response, next: NextFunction) => {
   try {
      const id = req.params.id
      const { name, avatar, password } = req.body
      const result = await userService.updateUserById(id, { name, avatar, password })
      return res.json(result)
   } catch (error) {
      next(error)
   }
}