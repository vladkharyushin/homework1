import {SortDataType} from "../../types/common";
import {blogCollection} from "../../db/db";
import {blogMapper} from "../../types/blog/blog-mapper";
import {OutputBlogType} from "../../types/blog/output";
import {ObjectId} from "mongodb";

export class QueryBlogRepository {
    static async getAllBlogs(sortData: SortDataType) {
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'cratedAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if (searchNameTerm) {
            filter = {name: {
                    $regex: searchNameTerm,
                    $options: "i"
                }
            }
        }

        const blogs = await blogCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await blogCollection.countDocuments(filter)

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: blogs.map(blogMapper),
        }
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }
}