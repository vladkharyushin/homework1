import jwt, {JwtPayload} from "jsonwebtoken";
import {JWT_SECRET} from "../config";

export class jwtService {
    static async createAccessToken(userId: string) {
        const accessToken = jwt.sign({userId}, JWT_SECRET, {expiresIn: "10000"})
        return accessToken
    }

    static async createRefreshToken(userId: string) {
        const refreshToken = jwt.sign({userId}, JWT_SECRET, {expiresIn: "20000"})
        return refreshToken
    }

    static async getUserIdByToken(accessToken: string) {
        try {
            const result: any = jwt.verify(accessToken, JWT_SECRET)
            return result.userId
        } catch (error) {
            console.log(error, 'error in verify')
            return null
        }
    }

    static async decodeToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload
        } catch (e) {
            return null
        }

    }
}