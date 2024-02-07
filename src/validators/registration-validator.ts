import {NextFunction, Request, Response} from "express";
import {UserRepository} from "../repositories/user-repository";

export const registrationValidator = async (req: Request, res: Response, next: NextFunction) => {
    const { login, email } = req.body

    const userIsExistsByLogin = await UserRepository.findByLoginOrEmail(login)

    if (userIsExistsByLogin) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Already exists",
                    field: "login"
                }
            ]
        })
        return
    }
    const userIsExistsByEmail = await UserRepository.findByLoginOrEmail(email)

    if (userIsExistsByEmail) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Already exists",
                    field: "email"
                }
            ]
        })
        return
    }
    return next()
}