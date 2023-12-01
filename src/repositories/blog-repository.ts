import {BlogType, OutputBlogType} from "../types/blog/output";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {blogMapper} from "../types/blog/blog-mapper";
import {InputBlogType, UpdateBlogData} from "../types/blog/input";
import {SortDataType} from "../types/common";

export class BlogRepository {
    static async getAllBlogs(sortData: SortDataType) {
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'cratedAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const blogs = await blogCollection.find({}).toArray()
        return blogs.map(blogMapper)
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }

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

    static async deleteBlogById(id: string): Promise<boolean> {
        const  result = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return !!result.deletedCount
 }
}