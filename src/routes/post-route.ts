import {Router, Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {PostParams} from "../types/post/input";
import {BlogRepository} from "../repositories/blog-repository";
import {randomUUID} from "crypto";
import {postValidation} from "../validators/posts-validator";
import {BlogParams} from "../types/blog/input";

export const postRoute = Router({})

postRoute.get('/', (req: Request, res: Response) => {
    const posts = PostRepository.getAllPosts()
    res.status(200).send(posts)
})

postRoute.get('/:id', (req: RequestWithParams<PostParams>, res: Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    if(!post){
        res.sendStatus(404)
    }
    res.status(200).send(post)
})

postRoute.post('/', authMiddleware, postValidation(), (req: RequestWithBody<PostParams>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const blog = BlogRepository.getBlogById(blogId)

    if(!blog) return res.sendStatus(404)

    const newPost = {
        id: randomUUID(),
        title,
        shortDescription,
        content,
        blogId
    }
    PostRepository.createNewPost(newPost)
    return res.sendStatus(201).send(newPost)
})

postRoute.put('/:id', authMiddleware, postValidation(), (req: RequestWithBodyAndParams<Params, PostParams>, res: Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    const {title, shortDescription, content, blogId} = req.body

    if(!post){
        res.sendStatus(404)
        return
    }
    (post.title = title);
    (post.shortDescription = shortDescription);
    (post.content = content);
    (post.blogId = blogId);
    return res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, postValidation(), (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const isDeleted = PostRepository.deletePostById(id)

    if(isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
   }
})

//postRoute.delete('/:id', authMiddleware, postValidation(), (req: RequestWithParams<PostParams>, res: Response) => {
//    const id = req.params.id
//    const post = PostRepository.getPostById(id)
//    if(!post) {
//        res.sendStatus(404)
//        return
//    }
//   const  postIndex = db.posts.findIndex((p) => p.id == id)
//    if(postIndex == -1) {
//        res.sendStatus(404)
//        return;
//    }
//    db.posts.splice(postIndex, 1)
//    res.sendStatus(204)
//})