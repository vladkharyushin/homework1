import {InputUserType} from "../types/user/input";
import {OutputUserType, UserDbType} from "../types/user/output";
import {UserService} from "./user-service";
import {ObjectId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {UserRepository} from "../repositories/user-repository";
import {emailsManager} from "../managers/email-manager";
import {userMapper} from "../types/user/user-mapper";
import bcrypt from "bcrypt";

export class authService {
    static async createUserByRegistration(newUser: InputUserType): Promise<OutputUserType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await UserService._generateHash(newUser.password, passwordSalt)
        const user: UserDbType = {
            _id: new ObjectId(),
            login: newUser.login,
            email: newUser.email,
            createdAt: new Date(),
            passwordHash,
            passwordSalt,
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30
                }),
                isConfirmed: false
            }
        }
        await UserRepository.createUser(user)

        try {
            await emailsManager.sendEmailConfirmationMessage(
                user.email,
                user.emailConfirmation.confirmationCode
            )
        } catch (error) {
            console.log('Send email error', error)
           // await UserRepository.deleteUserById(user._id.toString())
            return null
        }
        return userMapper(user)
    }

    static async resendEmail(email: string): Promise<any> {
        const user = await UserRepository.findByLoginOrEmail(email)

        if (!user)
            return null

        if(user.emailConfirmation.isConfirmed)
            return null

        const newConfirmationCode = randomUUID()

        await UserRepository.updateConfirmationCode(user._id, newConfirmationCode)

        console.log(user)

        try {
            await emailsManager.resendConfirmationMessage(
                user.email,
                newConfirmationCode
            )
            return user
        } catch (error) {
            console.log('Send email error', error)
            //await UserRepository.deleteUserById(user._id.toString())
            return null
        }
    }

    static async confirmEmail(code: string): Promise<boolean> {
        const user = await UserService.findUserByConfirmationCode(code)
        if (!user)
            return false
        if (user.emailConfirmation.isConfirmed)
            return false
        if (user.emailConfirmation.confirmationCode !== code)
            return false
        if (user.emailConfirmation.expirationDate < new Date())
            return false
        const result = await UserRepository.updateConfirmation(user._id)

        return result
    }
}