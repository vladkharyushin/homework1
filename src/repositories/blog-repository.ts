import {BlogType, OutputBlogType} from "../types/blog/output";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {blogMapper} from "../types/blog/blog-mapper";
import {InputBlogType, UpdateBlogData} from "../types/blog/input";

export class BlogRepository {
    static async getAllBlogs() {
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

//    static createBlog(createBlog: BlogType) {
//        db.blogs.push(createBlog)
//    }

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
                    webisteUrl: updateData.websiteUrl,
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

//        const blogIndex = db.blogs.findIndex(b => b.id === id)
//        const blog = db.blogs.find(b => b.id === id)
//
//       if(blog) {
//            db.blogs.splice(blogIndex, 1)
//            return true
//            } else {
//            return false
//        }