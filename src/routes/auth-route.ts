import {Router, Request, Response} from "express";
import {authValidation} from "../validators/auth-validator";
import {RequestWithBody} from "../types/common";
import {InputAuthType} from "../types/auth/input";
import {UserService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authTokenMiddleware} from "../middlewares/auth/auth-token-middleware";

export const authRoute = Router({})

authRoute.post('/login', authValidation(), async (req: RequestWithBody<InputAuthType>, res: Response) => {
    const user = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (user) {
        const accessToken = await jwtService.createJWT(user.toString())
        return res.status(200).send({accessToken})
    }
    return res.sendStatus(401)
})

authRoute.get('/me', authTokenMiddleware, authValidation(), async (req: Request, res: Response) => {
        const user = req.user
        if (!user) {
            return res.sendStatus(401)
        }
        const userData = {
            email: user.email,
            login: user.login,
            userId: user.id,
        }
        return res.status(200).send(userData)
    }
)