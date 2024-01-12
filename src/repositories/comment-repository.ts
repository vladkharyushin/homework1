import {UpdateCommentData} from "../types/comment/input";
import {CommentService} from "../domain/comment-service";
import {commentCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class CommentRepository {
    static async updateComment(id: string, updateData: UpdateCommentData) {
        const comment = await CommentService.updateComment(id, updateData);
        return comment
    }
    static async deleteComment(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(id)})

        return !!result.deletedCount
    }
}