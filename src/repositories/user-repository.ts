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
        createdUser.id = result.insertedId.toString()
        return {
            id: createdUser.id,
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt
        }
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!result.deletedCount
    }
}