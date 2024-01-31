import {InputUserType} from "../types/user/input";
import {OutputUserType, UserDbType} from "../types/user/output";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {UserRepository} from "../repositories/user-repository";
import {userMapper} from "../types/user/user-mapper";

export class UserService {
    static async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    static async createUser(newUser: InputUserType): Promise<OutputUserType> {
        const passwordHash = await this._generateHash(newUser.password)

        const createdUser: UserDbType = {
            _id: new ObjectId(),
            login: newUser.login,
            email: newUser.email,
            createdAt: new Date(),
            passwordHash,
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30
                }),
                isConfirmed: false
            }
        }
        await UserRepository.createUser(createdUser)

        return userMapper(createdUser)
    }


    static async checkCredentials(loginOrEmail: string, password: string): Promise<UserDbType | null> {
        const user = await UserRepository.findByLoginOrEmail(loginOrEmail)

        if (!user)
            return null

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }

        const passwordHash = await this._generateHash(password)

        if (user.passwordHash !== passwordHash) {
            return null
        }

        return user
    }

    static async findUserByConfirmationCode(code: string) {
        const foundedUser = await UserRepository.findByConfirmationCode(code)
        return foundedUser
    }
}