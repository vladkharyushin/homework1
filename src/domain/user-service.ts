import {InputUserType} from "../types/user/input";
import {UserRepository} from "../repositories/user-repository";

export class UserService{
    static async createUser(newUser: InputUserType){
        const user = await UserRepository.createUser(newUser)
        return user
    }
}