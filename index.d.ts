import {OutputUserType} from "./types/user/output";

declare global {
    namespace Express {
        export interface Request {
            user: OutputUserType | null
        }
    }
}