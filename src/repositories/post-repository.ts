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
    static createPost(postToCreate: PostType) {
        db.posts.push(postToCreate)
    }
    static deletePostById(id: string) {
        const postIndex = db.posts.findIndex(p => p.id === id)
        const post = db.posts.find(p => p.id === id)

        if(post) {
            db.posts.splice(postIndex, 1)
            return true
        } else {
            return false
        }
    }
}