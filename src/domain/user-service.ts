import {InputUserType} from "../types/user/input";
import {UserRepository} from "../repositories/user-repository";
import {UserType} from "../types/user/output";

export class UserService{
    static async createUser(newUser: InputUserType){
        const user: UserType = await UserRepository.createUser(newUser)
        return user
    }
}