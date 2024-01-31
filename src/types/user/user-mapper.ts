import {WithId} from "mongodb";
import {OutputUserType, UserDbType, UserType} from "./output";


export const userMapper = (user: UserDbType): OutputUserType => {
    return {
        id: user._id!.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toString()
    }
}