import {Router, Request, Response} from "express";
import {authValidation} from "../validators/auth-validator";
import {RequestWithBody} from "../types/common";
import {InputAuthType} from "../types/auth/input";
import {UserService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authTokenMiddleware} from "../middlewares/auth/auth-token-middleware";
import {authService} from "../domain/auth-service";
import {userValidation} from "../validators/user-validator";
import {registrationValidator} from "../validators/registration-validator";
import {UserRepository} from "../repositories/user-repository";
import {tokenCollection} from "../db/db";

export const authRoute = Router({})

authRoute.post('/login', authValidation(), async (req: RequestWithBody<InputAuthType>, res: Response) => {
    const user = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)
    console.log(user)

    if (user) {
        const accessToken = await jwtService.createAccessToken(user._id.toString())

        const refreshToken = await jwtService.createRefreshToken(user._id.toString())

        return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})
    }
    return res.sendStatus(401)
})

authRoute.post('/logout', async (req: Request, res: Response) => {
    const tokenRefresh = req.cookies.refreshToken

    if (!tokenRefresh) {
        return res.sendStatus(401)
    }

    const blackToken = await tokenCollection.findOne({token: tokenRefresh});

    if (blackToken) {
        return res.sendStatus(401)
    }

    await tokenCollection.insertOne({token: tokenRefresh})

    return res.sendStatus(204)
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
})

authRoute.post('/registration', userValidation(), registrationValidator, async (req: Request, res: Response) => {
    const userData = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    }

    const registrationResult = await authService.createUserByRegistration(userData)

    if (registrationResult) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
})

authRoute.post('/registration-email-resending', async (req: Request, res: Response) => {
    const user = await UserRepository.findByLoginOrEmail(req.body.email)
    const resendCode = await authService.resendEmail(req.body.email)

    if (resendCode) {
        res.sendStatus(204)

    } else if (!user) {
        res.status(400).send({errorsMessages: [{message: "Incorrect email", field: "email"}]})

    } else if (user.emailConfirmation.isConfirmed) {
        res.status(400).send({errorsMessages: [{message: "Email already confirmed", field: "email"}]})

    } else {
        res.status(400).send({})
    }
})

authRoute.post('/registration-confirmation', async (req: Request, res: Response) => {
    const user = await UserService.findUserByConfirmationCode(req.body.code)

    const result = await authService.confirmEmail(req.body.code)

    if (result) {
        res.sendStatus(204)

    } else if (!user) {
        res.status(400).send({errorsMessages: [{message: "Confirmation code incorrect", field: "code"}]})

    } else if (user.emailConfirmation.isConfirmed) {
        res.status(400).send({errorsMessages: [{message: "Confirmation code already confirmed", field: "code"}]})

    } else {
        res.sendStatus(400)
    }
})

authRoute.post('/refresh-token', async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken

    if (!token) {
        return res.sendStatus(401)
    }
    const blackToken = await tokenCollection.findOne({token: token})
    if (blackToken) {
        return res.sendStatus(401)
    }

    const resultUpdateToken = await authService.updateRefreshToken(token)

    if (!resultUpdateToken.success) {
        return res.sendStatus(401)
    }
    return res
        .cookie('refreshToken', resultUpdateToken!.data!.refreshToken, {httpOnly: true, secure: true})
        .status(200)
        .send({accessToken: resultUpdateToken!.data!.accessToken})
})
