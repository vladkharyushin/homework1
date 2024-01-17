import {InputUserType} from "../types/user/input";
import {OutputUserType, UserDbType, UserType} from "../types/user/output";
import bcrypt from "bcrypt";
import {userCollection} from "../db/db";
import {WithId} from "mongodb";

export class UserService{
    static async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
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
            login: newUser.login,
            email: newUser.email,
            createdAt: createdUser.createdAt,
            id: result.insertedId.toString(),
        }
    }

    static async findByLoginOrEmail(loginOrEmail: string) {
        return userCollection.findOne({
            $or: [
                {email: loginOrEmail},
                {login: loginOrEmail}
            ]
        })
    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserDbType> | null> {
        const user = await UserService.findByLoginOrEmail(loginOrEmail);

        if (!user)
            return null

        const passwordHash = await this._generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return null
        }

        return user
    }
}