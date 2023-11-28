import {body} from "express-validator";
import {BlogRepository} from "../repositories/blog-repository";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

const blogIdValidation = body('blogId')
    .isString()
    .trim()
    .custom((value) => {
    const blog = BlogRepository.getBlogById(value)
    if(!blog) {
        throw new Error('Incorrect blogId')
    }
    return true
})
    .withMessage('Incorrect blogId')

const titleValidation = body("title")
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Incorrect title')

const shortDescriptionValidation = body("shortDescription")
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Incorrect short description')

const contentValidation = body("content")
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('Incorrect content')

export const postValidation = () => [
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputModelValidation
]