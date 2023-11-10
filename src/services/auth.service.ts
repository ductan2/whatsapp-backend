import UserModel from "~/models/user.model";
import { AuthType, JwtType, LoginType } from "~/types/auth.type";
import { ErrorWithStatus } from "~/types/error.type";

import bcrypt from 'bcrypt'
import { sign, verify } from "~/utils/token";

class AuthService {
   private async hassPassword(password: string) {
      password = await bcrypt.hash(password, 10)
      return password
   }
   private async comparePassword(password: string, hash: string) {
      const isMatch = await bcrypt.compare(password, hash)
      return isMatch
   }
   private async generateToken(user_id: string, expiresIn: string = "1d", secret: string) {
      const token = await sign({ user_id }, expiresIn, secret)
      return token
   }
   async register(body: AuthType) {
      const isEmail = await UserModel.findOne({ email: body.email })
      if (isEmail) {
         throw new ErrorWithStatus({
            message: "Email is already exist!",
            status: 400,
            path: "email"
         })
      }
      const user = await UserModel.create({
         ...body,
         password: await this.hassPassword(body.password)
      })

      return user
   }
   async login(body: LoginType) {
      const user = await UserModel.findOne({ email: body.email })
      if (!user) {
         throw new ErrorWithStatus({
            message: "Email is not found!",
            status: 404,
            path: "email"
         })
      }
      const isMatch = await this.comparePassword(body.password, user.password)
      if (!isMatch) {
         throw new ErrorWithStatus({
            message: "Password does not match!",
            status: 401,
            path: "password"
         })
      }
      const token = await this.generateToken(user._id.toString(), "1d",
         process.env.ACCESS_TOKEN_SECRET as string)
      const refresh_token = await this.generateToken(user._id.toString(), "7d",
         process.env.REFRESH_TOKEN_SECRET as string)

      return {
         token,
         refresh_token,
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            status: user.status,
            avatar: user.avatar,
         },
      }
   }
   async refreshToken(refresh_token: string) {
      if (!refresh_token) throw new ErrorWithStatus({
         message: "Refresh token is required. Please login!",
         status: 400,
         path: "refresh_token"
      })
      const jwtDecode = await verify(refresh_token, process.env.REFRESH_TOKEN_SECRET as string)
      const { user_id } = jwtDecode as JwtType
      const user = await UserModel.findById(user_id).select("-password")
      return {
         token: await this.generateToken(user_id, "1d", process.env.ACCESS_TOKEN_SECRET as string),
         user,
      }

   }

}

export const authService = new AuthService();
