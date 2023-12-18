import {InputUserType} from "../types/user/input";
import {OutputUserType, UserType} from "../types/user/output";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";

export class UserRepository {
    static async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async createUser(newUser: InputUserType): Promise<OutputUserType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newUser.password, passwordSalt)

        const createdUser = {
            login: newUser.login,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordSalt
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
    static async findByLoginOrEmail(loginOrEmail: string): Promise< UserType | null> {
       return userCollection.findOne({
            $or: [
                {email: loginOrEmail},
                {login: loginOrEmail}
            ]
        })
    }
    static async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await UserRepository.findByLoginOrEmail(loginOrEmail);

        if (!user)
            return false

        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return true
    }
}