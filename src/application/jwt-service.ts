import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config";

export class jwtService {
    static async createJWT(userId: string) {
        const token = jwt.sign({userId}, JWT_SECRET, {expiresIn: "1h"})
        return token
    }
    static async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}