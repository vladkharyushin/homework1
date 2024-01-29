import {MongoClient} from "mongodb";
import {BlogType} from "../types/blog/output";
import {PostType} from "../types/post/output";
import {UserDbType} from "../types/user/output";
import {AuthType} from "../types/auth/input";
import {CommentType} from "../types/comment/output";
import {mongoUrl} from "../config";

export const port = 80;

//const mongoUrl = process.env.MONGO_URL

console.log(mongoUrl)

if(!mongoUrl){
    throw new Error('URL not found')
}

const client = new MongoClient(mongoUrl)

const db = client.db('node-blog')

export const blogCollection = db.collection<BlogType>('blog')

export const postCollection = db.collection<PostType>('post')

export const userCollection = db.collection<UserDbType>('user')

export const authCollection = db.collection<AuthType>('auth')

export const commentCollection = db.collection<CommentType>("comments")

export const runDb = async () => {
    try {
        await client.connect()
        console.log('Client connected to DB')
        console.log(`Listen on port ${port}`)
    }catch (e) {
        console.log(`${e}`)
        await client.close()
    }
}