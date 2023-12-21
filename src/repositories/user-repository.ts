import {InputUserType} from "../types/user/input";
import {OutputUserType} from "../types/user/output";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {UserService} from "../domain/user-service";

export class UserRepository {
    static async createUser(newUser: InputUserType): Promise<OutputUserType> {
        const user = await UserService.createUser(newUser)
        return user
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!result.deletedCount
    }
}