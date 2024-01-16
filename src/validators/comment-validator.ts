import {body, param} from "express-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {notFoundValidation} from "./not-found-validator";
import {QueryPostRepository} from "../repositories/query-repository/query-post-repository";

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

export const postIdInParamsValidation = param("postId")
    .isString()
    .trim()
    .custom(async (value) => {
        const post = await QueryPostRepository.getPostById(value)

        if (!post) {
            throw new Error("Incorrect postId");
        }
    })
    .withMessage("Incorrect postID")