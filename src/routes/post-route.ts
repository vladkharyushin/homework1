import {Router, Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {PostParams} from "../types/post/input";
import {BlogRepository} from "../repositories/blog-repository";
import {postValidation} from "../validators/posts-validator";
import {BlogParams} from "../types/blog/input";
import {OutputPostType} from "../types/post/output";

export const postRoute = Router({})

postRoute.get('/', async (req: Request, res: Response) => {
    const posts = await PostRepository.getAllPosts()
    res.status(200).send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id
    const post = await PostRepository.getPostById(id)
    if(!post){
        res.sendStatus(404)
    }
    res.status(200).send(post)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<PostParams>, res: Response) => {
        const blog = await BlogRepository.getBlogById(req.body.blogId);
        if (!blog) {
            res.sendStatus(404)
            return
        }
        const post = await PostRepository.createNewPost({
            ...req.body,
            blogName: blog.name,
        })

        return res.status(201).send(post)
    })

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithBodyAndParams<Params, PostParams>, res: Response) => {
    const id = req.params.id
    const post: OutputPostType | null = await PostRepository.getPostById(id)
    const { title, shortDescription, content, blogId } = req.body

    if (!post) {
        res.sendStatus(404)
        return
    }

    (post.title = title),
        (post.shortDescription = shortDescription),
        (post.content = content),
        (post.blogId = blogId)
    await PostRepository.updatePost(id, post);

    return res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const status = await PostRepository.deletePost(id)
    if (status == false) {
        res.sendStatus(404)
        return
    }
    return res.sendStatus(204)
})

//postRoute.delete('/:id', authMiddleware, postValidation(), (req: RequestWithParams<PostParams>, res: Response) => {
//    const id = req.params.id
//    const post = PostRepository.getPostById(id)
//    if(!post) {
//        res.sendStatus(404)
//       return
//    }
//   const  postIndex = db.posts.findIndex((p) => p.id == id)
//    if(postIndex == -1) {
//       res.sendStatus(404)
//        return;
//    }
//    db.posts.splice(postIndex, 1)
//   res.sendStatus(204)
//})