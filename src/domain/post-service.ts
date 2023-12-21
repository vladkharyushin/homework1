import {InputPostType, UpdatePostData} from "../types/post/input";
import {PostType} from "../types/post/output";
import {postCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class PostService {
    static async createNewPost(newPost: InputPostType): Promise<PostType> {
        const createdPost: PostType = {
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: new Date().toISOString(),
        }
        const result = await postCollection.insertOne({...createdPost});
        createdPost.id = result.insertedId.toString();
        return createdPost;
    }

    static async updatePost(id: string, updateData: UpdatePostData): Promise<boolean> {
        const result = await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: updateData.title,
                    shortDescription: updateData.shortDescription,
                    content: updateData.content,
                    blogId: updateData.blogId,
                },
            })
        return !!result.matchedCount
    }


}