import {Router, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {
    BlogIdParams,
    Params,
    RequestTypeWithQueryBlogId,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    SortDataType
} from "../types/common";
import {BlogParams, InputBlogType} from "../types/blog/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    allPostsByBlogIdValidation,
    blogPostValidation
} from "../validators/blogs-validator";
import {OutputBlogType} from "../types/blog/output";
import {ObjectId} from "mongodb";
import {BlogService} from "../domain/blog-service";
import {QueryBlogRepository} from "../repositories/query-repository/query-blog-repository";
import {postBlogIdValidation} from "../validators/posts-validator";
import {CreatePostToBlogType} from "../types/post/output";
import {QueryPostRepository} from "../repositories/query-repository/query-post-repository";

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestWithQuery<SortDataType>, res: Response) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }

    const blogs =  await QueryBlogRepository.getAllBlogs(sortData)
    res.status(200).send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<Params>, res: Response) => {
        const id = req.params.id
        if(!id || !ObjectId.isValid(id)){
            res.sendStatus(404)
            return
        }
        const blog = await QueryBlogRepository.getBlogById(id)
        if(!blog){
            res.sendStatus(404)
            return
        }
        res.status(200).send(blog)
})

blogRoute.get('/:blogId/posts', allPostsByBlogIdValidation(), async (req: RequestTypeWithQueryBlogId<SortDataType, BlogIdParams>, res: Response) => {
        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        };
        const blogId = req.params.blogId
        const foundPosts = await QueryPostRepository.getAllPosts({
        ...sortData,
        blogId,
    })
    res.status(200).send(foundPosts)
    })

blogRoute.post('/', authMiddleware, blogPostValidation(), async (req: RequestWithBody<InputBlogType>, res: Response) => {
    const blog = await BlogService.createBlog(req.body)

    return res.status(201).send(blog)
})

blogRoute.post('/:blogId/posts', authMiddleware, postBlogIdValidation(), async (
    req: RequestWithBodyAndParams<BlogIdParams, CreatePostToBlogType>,
    res: Response) => {
    const id = req.params.blogId
    const {title, shortDescription, content} = req.body
    const blog = await QueryBlogRepository.getBlogById(id)

    if (!blog){
        res.sendStatus(404)
        return
    }

    const createdPost = await BlogService.createPostToBlog(id, {
            title,
            shortDescription,
            content,
        })

    if (!createdPost) {
        res.sendStatus(404)
        return
    }

        return res.status(201).send(createdPost)
    })

blogRoute.put('/:id', authMiddleware, blogPostValidation(), async (req: RequestWithBodyAndParams<Params, BlogParams>, res: Response,) => {
    const id = req.params.id
    if(!id || !ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    const blog: OutputBlogType | null= await QueryBlogRepository.getBlogById(id)
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