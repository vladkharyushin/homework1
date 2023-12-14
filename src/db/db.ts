import {MongoClient} from "mongodb";
import {BlogType} from "../types/blog/output";
import {PostType} from "../types/post/output";
import dotenv from 'dotenv'
import {UserType} from "../types/user/output";
dotenv.config()

export const port = 80;

const mongoUrl = process.env.MONGO_URL

console.log(mongoUrl)

if(!mongoUrl){
    throw new Error('URL not found')
}

const client = new MongoClient(mongoUrl)

const db = client.db('node-blog')

export const blogCollection = db.collection<BlogType>('blog')

export const postCollection = db.collection<PostType>('post')

export const userCollection = db.collection<UserType>('user')

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