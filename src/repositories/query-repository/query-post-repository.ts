import {SortDataType} from "../../types/common";
import {postCollection} from "../../db/db";
import {postMapper} from "../../types/post/post-mapper";
import {OutputPostType} from "../../types/post/output";
import {ObjectId} from "mongodb";

export class QueryPostRepository{
    static async getAllPosts(sortData: SortDataType) {
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const sortBy = sortData.sortBy ?? "createdAt"
        const sortDirection = sortData.sortDirection ?? "desc"
        const blogId = sortData.blogId

        let filter = {};

        if (blogId) {
            filter = {
                blogId: blogId,
            }
        }

        const posts = await postCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments(filter)

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: posts.map(postMapper)
        }
    }

    static async getPostById(id: string): Promise<OutputPostType | null> {
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return postMapper(post)
    }
}