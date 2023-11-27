import {db} from "../db/db";
import {BlogType} from "../types/blog/output";

export class BlogRepository {
    static getAllBlogs() {
        return db.blogs
    }

    static getBlogById(id: string) {
        const blog = db.blogs.find(b => b.id === id)
        if (!blog) {
            return null
        }
        return blog
    }
    static createBlog(createBlog: BlogType) {
        db.blogs.push(createBlog)
    }
    static deleteBlogById(id: string) {
        const blogIndex = db.blogs.findIndex(b => b.id === id)
        const blog = db.blogs.find(b => b.id === id)

        if(blog) {
            db.blogs.splice(blogIndex, 1)
            return true
        } else {
            return false
        }
    }
}