import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

const loginOrEmailValidation = body('loginOrEmail')
    .trim()
    .isString()
    .isLength({min: 3, max:50})
    .custom(async (value) => {
        console.log({value})
    if (/^[a-zA-Z0-9_-]*$/.test(value)) {
        return true
    } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        return true
    } else {
        throw new Error('Incorrect login or email')
    }
})
   .withMessage('Incorrect login or email')

const passwordValidation = body('password')
    .isLength({min: 6, max:20})
    .trim()
    .isString()
    .withMessage('Incorrect password')

export const authValidation = () =>
    [
        loginOrEmailValidation,
        passwordValidation,
        inputModelValidation
    ]