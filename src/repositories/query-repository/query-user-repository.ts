import {UserSortDataType} from "../../types/user/output";
import {userCollection} from "../../db/db";
import {userMapper} from "../../types/user/user-mapper";

export class QueryUserRepository {
    static async getAllUsers(sortData: UserSortDataType) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null

        let filterLogin = {}

        let filterEmail = {}

        if(searchLoginTerm){
            filterLogin = {
                login: {
                    $regex: searchLoginTerm,
                    $options: 'i'
                }
            }
        }

        if(searchEmailTerm){
            filterEmail = {
                login: {
                    $regex: searchEmailTerm,
                    $options: 'i'
                }
            }
        }

        const filter = {
            $or: [
                filterLogin,
                filterEmail
            ]
        }

        const users = await userCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await userCollection.countDocuments()

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: users.map(userMapper)
        }
    }
}