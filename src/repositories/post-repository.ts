import {db} from "../db/db";
import {PostType} from "../types/post/output";

export class PostRepository {
    static getAllPosts(){
        return db.posts
    }
    static getPostById(id: string){
        const post = db.posts.find(p => p.id === id)
        if(!post) {
            return null
        }
        return post
    }
    static createPost(createPost: PostType) {
        const newPost = db.posts.push(createPost)
        return newPost
    }
}