import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {notFoundValidation} from "./not-found-validator";

const contentValidation = body("content")
    .isString()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage("Incorrect value");

export const commentValidation = () => [
    contentValidation,
    inputModelValidation,
    notFoundValidation,
]