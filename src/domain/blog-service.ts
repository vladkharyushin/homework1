import {InputBlogType, UpdateBlogData} from "../types/blog/input";
import {PostRepository} from "../repositories/post-repository";
import {QueryBlogRepository} from "../repositories/query-repository/query-blog-repository";
import {BlogType} from "../types/blog/output";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class BlogService {
    static async createBlog(newBlog: InputBlogType): Promise<BlogType> {
        const createdBlog: BlogType = {
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = await blogCollection.insertOne({ ...createdBlog });
        createdBlog.id = result.insertedId.toString();
        return createdBlog;
    }


    static async createPostToBlog(blogId: string, postData: {
            title: string
            shortDescription: string
            content: string
        })
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
        if(!post){
            return null
        }
        return post
    }

    static async updateBlog(id: string, updateData: UpdateBlogData): Promise<boolean> {
        const result = await blogCollection.updateOne(
            {_id: new ObjectId(id)}, {
                $set: {
                    name: updateData.name,
                    description: updateData.description,
                    websiteUrl: updateData.websiteUrl,
                },
            }
        )

        return !!result.matchedCount
    }
}