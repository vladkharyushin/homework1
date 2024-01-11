import {OutputUserType} from "./types/user/output";

export {}

declare global {
    namespace Express {
        export interface Request {
            user: OutputUserType | null
        }
    }
}