import {BlogRepository} from "../repositories/blog-repository";
import {InputBlogType} from "../types/blog/input";
import {PostRepository} from "../repositories/post-repository";
import {QueryBlogRepository} from "../repositories/query-repository/query-blog-repository";

export class BlogService {
    static async createBlog(newBlog: InputBlogType) {
        const blog = await BlogRepository.createBlog(newBlog)
        return blog
}
    static async createPostToBlog(blogId: string, postData: {
            title: string
            shortDescription: string
            content: string
        }
    )
    {
        const blog = await QueryBlogRepository.getBlogById(blogId);

        if (!blog) {
            return null
        }
        const post = await PostRepository.createNewPost({
            ...postData,
            blogId,
            blogName: blog.name,
        })
//        if(!post){
//            return null
//        }
        return post
    }
}