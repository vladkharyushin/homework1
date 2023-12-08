import {BlogType} from "../types/blog/output";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {InputBlogType, UpdateBlogData} from "../types/blog/input";


export class BlogRepository {
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