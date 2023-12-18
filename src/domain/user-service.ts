import {InputUserType} from "../types/user/input";
import {UserRepository} from "../repositories/user-repository";
import {OutputUserType, UserType} from "../types/user/output";

export class UserService{
    static async createUser(newUser: InputUserType): Promise<OutputUserType> {

        const user: OutputUserType = await UserRepository.createUser(newUser)
        return user
    }
}