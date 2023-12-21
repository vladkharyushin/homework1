import {Router, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    Params,
    RequestWithBodyAndBlog,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    SortDataType
} from "../types/common";
import {PostParams} from "../types/post/input";
import {postValidation} from "../validators/posts-validator";
import {OutputPostType} from "../types/post/output";
import {ObjectId} from "mongodb";
import {QueryPostRepository} from "../repositories/query-repository/query-post-repository";
import {QueryBlogRepository} from "../repositories/query-repository/query-blog-repository";

export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<SortDataType>, res: Response) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const posts = await QueryPostRepository.getAllPosts(sortData)
    res.status(200).send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id
    if(!id || !ObjectId.isValid(id)){
        res.sendStatus(404)
        return
    }
    const post = await QueryPostRepository.getPostById(id)
    if(!post){
        res.sendStatus(404)
        return
    }
    res.status(200).send(post)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBodyAndBlog<OutputPostType>, res: Response) => {
        const blog = await QueryBlogRepository.getBlogById(req.body.blogId)
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
    if(!id || !ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    const post: OutputPostType | null = await QueryPostRepository.getPostById(id)
    const {title, shortDescription, content, blogId} = req.body

    if (!post) {
        res.sendStatus(404)
        return
    }

    (post.title = title);
        (post.shortDescription = shortDescription);
        (post.content = content);
        (post.blogId = blogId)
    await PostRepository.updatePost(id, post);

    return res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id
    if(!id || !ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    const status = await PostRepository.deletePost(id)
    if (!status) {
        res.sendStatus(404)
        return
    }
    return res.sendStatus(204)
})