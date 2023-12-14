import {InputUserType} from "../types/user/input";
import {UserType} from "../types/user/output";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class UserRepository {
    static async createUser(newUser: InputUserType): Promise<UserType> {
        const createdUser: UserType = {
            login: newUser.login,
            email: newUser.email,
            createdAt: new Date().toISOString()
        }

        const result = await userCollection.insertOne({...createdUser})

        return {
            ...createdUser,
            id: result.insertedId.toString(),
        }
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!result.deletedCount
    }
}