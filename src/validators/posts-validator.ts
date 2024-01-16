import {body , param} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {QueryBlogRepository} from "../repositories/query-repository/query-blog-repository";
import {notFoundValidation} from "./not-found-validator";
import {postIdInParamsValidation} from "./comment-validator";

const blogIdBodyValidation = body('blogId')
    .isString()
    .trim()
    .custom(async (value, meta) => {
    const blog = await QueryBlogRepository.getBlogById(value)
    if(!blog) {
        throw new Error('Incorrect blogId')
    }
        meta.req.blog = blog
})
    .withMessage('Incorrect blogId')

export const blogIdParamsValidation = param('blogId')
    .isString()
    .trim()
    .custom(async (value) => {
        const blog = await QueryBlogRepository.getBlogById(value);

        if (!blog) {
            throw new Error('Incorrect blogId!');
        }
    })
    .withMessage('Incorrect blogId!');

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
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidation,
    inputModelValidation
]

export const postBlogIdValidation = () => [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputModelValidation,
    blogIdParamsValidation,
    notFoundValidation,
]

export const allCommentsForPostByIdValidation = () => [
    postIdInParamsValidation,
    notFoundValidation
]