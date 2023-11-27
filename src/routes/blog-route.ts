import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {Params, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {BlogParams} from "../types/blog/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogPostValidation} from "../validators/blogs-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";

export const blogRoute = Router({})

blogRoute.get('/', (req: Request, res: Response) => {
    const blogs = BlogRepository.getAllBlogs()
    res.send(blogs)
})

blogRoute.get('/:id', authMiddleware, (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)
    if(!blog){
        res.sendStatus(404)
    }
    res.send(blog)
})

blogRoute.post('/:id', authMiddleware, blogPostValidation(), inputModelValidation, (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)
    if(!blog){
        res.sendStatus(404)
    }
    res.send(blog)
})

blogRoute.put('/:id', authMiddleware, blogPostValidation(), inputModelValidation, (req: RequestWithBodyAndParams<Params, BlogParams>, res: Response,) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)

    if(!blog){
        res.sendStatus(404)
        return
    }
    return res.sendStatus(204)
}
)