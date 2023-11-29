import {MongoClient} from "mongodb";
import {BlogType} from "../types/blog/output";
import {PostType} from "../types/post/output";

export const port = 80;

//const mongoUrl = 'mongodb://localhost:27017'
const mongoUrl = 'mongodb+srv://vladislavkharyushin:311097Vx@cluster0.zirpent.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(mongoUrl)

const db = client.db('node-blog')

export const blogCollection = db.collection<BlogType>('blog')

export const postCollection = db.collection<PostType>('post')

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