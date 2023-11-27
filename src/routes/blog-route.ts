import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {BlogParams} from "../types/blog/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogPostValidation} from "../validators/blogs-validator";
import {inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import {randomUUID} from "crypto";

export const blogRoute = Router({})

blogRoute.get('/', (req: Request, res: Response) => {
    const blogs = BlogRepository.getAllBlogs()
    res.status(200).send(blogs)
})

blogRoute.get('/:id', (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)
    if(!blog){
        res.sendStatus(404)
    }
    res.status(200).send(blog)
})

blogRoute.post('/', authMiddleware, blogPostValidation(), (req: RequestWithBody<BlogParams>, res: Response) => {
    let {name, description, websiteUrl} = req.body

    const newBlog = {
        id: randomUUID(),
        name,
        description,
        websiteUrl
    }
    BlogRepository.createBlog(newBlog)
    return res.status(201).send(newBlog)
})

//blogRoute.post('/:id', authMiddleware, blogPostValidation(), (req: RequestWithParams<BlogParams>, res: Response) => {
//    const id = req.params.id
 //   const blog = BlogRepository.getBlogById(id)
 //   if(!blog){
//        res.sendStatus(404)
//    }
//.send(blog)
//})

blogRoute.put('/:id', authMiddleware, blogPostValidation(), (req: RequestWithBodyAndParams<Params, BlogParams>, res: Response,) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)
        const {name, description, websiteUrl} = req.body

    if(!blog){
        res.sendStatus(404)
        return
    }
        (blog.name = name);
            (blog.description = description);
            (blog.websiteUrl = websiteUrl);
    return res.sendStatus(204)
})

blogRoute.delete('/id', authMiddleware, (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const isDeleted = BlogRepository.deleteBlogById(id)

    if(isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})