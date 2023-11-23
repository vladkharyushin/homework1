import {body} from "express-validator";
import {BlogRepository} from "../repositories/blog-repository";

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