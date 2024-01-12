import {UpdateCommentData} from "../types/comment/input";
import {commentCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class CommentService {
    static async updateComment(id: string, updateData: UpdateCommentData): Promise<boolean> {
        const result = await commentCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    content: updateData.content,
                }
            }
        )
        return !!result.matchedCount
    }
}