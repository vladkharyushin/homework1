import {postCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {InputPostType, UpdatePostData} from "../types/post/input";
import {PostService} from "../domain/post-service";

export class PostRepository {
    static async createNewPost(newPost: InputPostType) {
        const post = await PostService.createNewPost(newPost);
        return post
    }

    static async updatePost(id: string, updatedPost: UpdatePostData) {
        const post = await PostService.updatePost(id, updatedPost);
        return post
    }

    static async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

        return !!result.deletedCount
    }
}