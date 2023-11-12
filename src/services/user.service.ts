import UserModel from "~/models/user.model";
import { UpdateType } from "~/types/auth.type";
import { ErrorWithStatus } from "~/types/error.type";

class UserService {
   async getUsers(search: string) {
      const users = await UserModel.find({
         $or: [
            { name: { $regex: search || "", $options: "i" } },
            { email: { $regex: search || "", $options: "i" } }
         ]
      })
         .select("-password")
         .exec();
      return users;
   }
   async getUserById(id: string) {
      const user = await UserModel.findById(id)
      if (!user) throw new ErrorWithStatus({
         message: "User not found",
         status: 404,
         path: "user"
      })
      return user
   }
   async updateUserById(id: string, data: UpdateType) {
      await this.getUserById(id)
      const userUpdate = await UserModel.updateOne({ _id: id }, data)
      return userUpdate
   }
}
const userService = new UserService();
export default userService;