import {WithId} from "mongodb";
import {OutputUserType, UserType} from "./output";


export const userMapper = (user: WithId<UserType>): OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}