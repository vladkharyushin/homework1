import {InputPostType, UpdatePostData} from "../types/post/input";
import {PostType} from "../types/post/output";
import {commentCollection, postCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {InputCommentType} from "../types/comment/input";
import {CommentType} from "../types/comment/output";
import {QueryPostRepository} from "../repositories/query-repository/query-post-repository";
import {PostRepository} from "../repositories/post-repository";

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

    static async createComment(newComment: InputCommentType): Promise<CommentType> {
        const createdComment: CommentType = {
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            postId: newComment.postId,
            createdAt: new Date().toISOString()
        }
        const comment = await PostRepository.createComment(createdComment)
        return comment
        // const result = await commentCollection.insertOne({...createdComment})
        // createdComment.id = result.insertedId.toString()
        // return createdComment
    }

    static async createCommentToPost(
            postId: string,
            content: string,
            userId: string,
            userLogin: string
    ) {
        const comment = await PostService.createComment({
            content,
            postId,
            commentatorInfo: {
                userId,
                userLogin
            }
        })
        return comment
    }
}