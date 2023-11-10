import { ParamSchema, checkSchema } from "express-validator";
import UserModel from "~/models/user.model";


const passwordSchema: ParamSchema = {
   notEmpty: true,
   isLength: {
      options: {
         min: 6,
         max: 50,
      }
   },
   isStrongPassword: {
      options: {
         minLength: 6,
         minLowercase: 1,
         minNumbers: 1,
         minUppercase: 1,
         minSymbols: 0
      },
      errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
   }
}
const confirmPasswordSchema: ParamSchema = {
   notEmpty: true,
   isLength: {
      options: {
         min: 6,
         max: 50,
      }
   },
   custom: {
      options: ((value, { req }) => {
         if (value !== req.body.password) {
            throw new Error("Confirm password does not match password!")
         }
         return true;
      })
   }
}
export const registerValidator = checkSchema({
   name: {
      isString: true,
      notEmpty: true,
   },
   email: {
      isString: true,
      notEmpty: true,
      isEmail: true,
      custom: {
         options: async (value, { req }) => {
            const user = await UserModel.findOne({ email: value })
            if (user) {
               throw new Error("Email is already exist!")
            }
         }
      }
   },
   avatar: {
      optional: true,
      isString: true,
   },
   status: {
      optional: true,
   },
   password: passwordSchema,
   confirm_password: confirmPasswordSchema
})
export const loginValidator = checkSchema({
   email: {
      isString: true,
      notEmpty: true,
      isEmail: true,
      custom: {
         options: async (value, { req }) => {
            const user = await UserModel.findOne({ email: value })
            if (!user) {
               throw new Error("Email not found!")
            }
         }
      }
   },
   password: passwordSchema,
})
