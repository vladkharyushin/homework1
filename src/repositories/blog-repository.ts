import {BlogType} from "../types/blog/output";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {InputBlogType, UpdateBlogData} from "../types/blog/input";
import {BlogService} from "../domain/blog-service";


export class BlogRepository {
    static async createBlog(newBlog: InputBlogType) {
        const blog: BlogType = await BlogService.createBlog(newBlog)
        return blog
    }

    static async updateBlog(id: string, updatedBlog: UpdateBlogData) {
        const blog = await BlogService.updateBlog(id, updatedBlog);
        return blog;
    }

    static async deleteBlogById(id: string): Promise<boolean> {
        const  result = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return !!result.deletedCount
 }
}