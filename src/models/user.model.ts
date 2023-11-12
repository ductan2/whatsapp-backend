
import mongoose, { Schema } from "mongoose";
import validator from "validator"
import { AuthType } from "~/types/auth.type";


const userSchema: Schema = new Schema<AuthType>({
   name: {
      type: String,
      required: [true, "Name is required"],
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validator: [validator.isEmail, "Please provide a valid email"]
   },
   avatar: {
      type: String,
      default: "https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png"
   },
   status: {
      type: String,
      default: "Hey there, I am using whatsapp"
   },
   password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
   },
}, { collection: "users", timestamps: true })


const UserModel =
   mongoose.models.UserModel as mongoose.Model<AuthType> ||
   mongoose.model<AuthType>("UserModel", userSchema);

export default UserModel

