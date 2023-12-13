import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .custom(async (value) => {
    if (/^[a-zA-Z0-9_-]{3, 10}$/.test(value)) {
        return true
    } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        return true
    } else {
        throw new Error('Incorrect login or email')
    }
})
    .withMessage('Incorrect login or email')

const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max:20})
    .withMessage('Incorrect password')

export const authLoginValidation = () =>
    [
        loginOrEmailValidation,
        passwordValidation,
        inputModelValidation
    ]