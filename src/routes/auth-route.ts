import {Router, Response} from "express";
import {authValidation} from "../validators/auth-validator";
import {RequestWithBody} from "../types/common";
import {AuthType} from "../types/auth/input";
import {UserService} from "../domain/user-service";

export const authRoute = Router({})

authRoute.post('/login', authValidation(), async (req: RequestWithBody<AuthType>, res: Response) => {
    const result = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!result) {
        res.sendStatus(401)
    } else {
        res.sendStatus(204)
    }
})