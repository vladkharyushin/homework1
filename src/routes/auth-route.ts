import {Router, Response} from "express";
import {authValidation} from "../validators/auth-validator";
import {RequestWithBody} from "../types/common";
import {InputAuthType} from "../types/auth/input";
import {UserService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";

export const authRoute = Router({})

authRoute.post('/login', authValidation(), async (req: RequestWithBody<InputAuthType>, res: Response) => {
    const user = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!user) {
        res.sendStatus(401)
    } else {
        const token = await jwtService.createJWT(user.toString());
        res.status(200).send(token)
        return
    }
})