import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {blogIdParamsValidation} from "./posts-validator";
import {notFoundValidation} from "./not-found-validator";

const nameValidation = body('name')
    .exists()
    .isString()
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('Incorrect name')

const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('Incorrect description')

const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .isURL()
//    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n')
    .withMessage('Incorrect websiteUrl')

export const blogPostValidation = () => [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputModelValidation
]

export const allPostsByBlogIdValidation = () => [
    blogIdParamsValidation,
    notFoundValidation,
];