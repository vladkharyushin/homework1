import {Router, Request, Response} from "express";
import {blogCollection, postCollection} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    res.sendStatus(204)
})

//testingRoute.delete('/all-data', (req: Request, res: Response) => {
//    db.videos = []
//    db.blogs = []
//    db.posts = []
//    res.sendStatus(204)
//})