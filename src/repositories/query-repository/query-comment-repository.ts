import {OutputCommentType} from "../../types/comment/output";
import {ObjectId} from "mongodb";
import {commentCollection} from "../../db/db";
import {commentMapper} from "../../types/comment/comment-mapper";
import {CommentSortDataType} from "../../types/comment/input";

export class QueryCommentRepository {
    static async getAllComments(sortData: CommentSortDataType) {
        const sortDirection = sortData.sortDirection ?? "desc"
        const sortBy = sortData.sortBy ?? "createdAt"
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const postId = sortData.postId

        let filter = {}

        if (postId) {
            filter = {
                postId: postId,
            }
        }

        const comments = await commentCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();

        const totalCount = await commentCollection.countDocuments(filter)

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: comments.map(commentMapper),
        }
    }

    static async getCommentById(id: string): Promise<OutputCommentType | null> {
        if (!ObjectId.isValid(id)) return null

        const comment = await commentCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }
        return commentMapper(comment)
    }
}