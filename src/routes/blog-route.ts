import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {BlogParams} from "../types/blog/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogPostValidation} from "../validators/blogs-validator";
import {OutputBlogType} from "../types/blog/output";
import {ObjectId} from "mongodb";

export const blogRoute = Router({})

blogRoute.get('/', async (req: Request, res: Response) => {
    const blogs =  await BlogRepository.getAllBlogs()
    res.status(200).send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<Params>, res: Response) => {
    try {
        const id = req.params.id
        if(!id || !ObjectId.isValid(id)){
            res.sendStatus(404)
            return
        }
        const blog = await BlogRepository.getBlogById(id)
        if(!blog){
            res.sendStatus(404)
            return
        }
        res.status(200).send(blog)
    } catch (e) {
        console.log(e)
    }

})

blogRoute.post('/', authMiddleware, blogPostValidation(), async (req: RequestWithBody<BlogParams>, res: Response) => {
    const blog = await BlogRepository.createBlog(req.body);

    return res.status(201).send(blog);
})

blogRoute.put('/:id', authMiddleware, blogPostValidation(), async (req: RequestWithBodyAndParams<Params, BlogParams>, res: Response,) => {
    const id = req.params.id
    if(!id || !ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    const blog: OutputBlogType | null= await BlogRepository.getBlogById(id)
        const {name, description, websiteUrl} = req.body

    if(!blog){
        res.sendStatus(404)
        return
    }
        (blog.name = name);
            (blog.description = description);
            (blog.websiteUrl = websiteUrl);
            await BlogRepository.updateBlog(id, blog)
    return res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    if(!id || !ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    const status = await BlogRepository.deleteBlogById(id);

    if (!status) {
        res.sendStatus(404);
        return;
    }
    return res.sendStatus(204);
})

//blogRoute.delete('/:id', authMiddleware, blogPostValidation(), (req: RequestWithParams<BlogParams>, res: Response) => {
//    const id = req.params.id
//    const blog = BlogRepository.getBlogById(id)
//    if(!blog) {
//        res.sendStatus(404)
//        return
//    }
//    const  blogIndex = db.blogs.findIndex((b) => b.id == id)
//    if(blogIndex == -1) {
//        res.sendStatus(404)
//        return;
//    }
//    db.blogs.splice(blogIndex, 1)
//    res.sendStatus(204)
//})