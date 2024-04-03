import {Request} from "express";
import {BlogType} from "./blog/output";

export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

export type ErrorMessageType = {
    field: string
    message: string
}
export type RequestWithParams<p> = Request<p, {}, {}, {}>

export type Params = {
    id: string
}

export type RequestWithBody<B> = Request<{}, {}, B, {}>

export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

export type RequestTypeWithQueryBlogId<Q, P> = Request<P, {}, {}, Q>

export type RequestTypeWithQueryPostId<Q, P> = Request<P, {}, {}, Q>

export type RequestWithBodyAndBlog<B> = Request<{}, {}, B, {}, BlogType>

export type RequestWithCommentBodyAndParams<P, B> = Request<P, {}, B, {}>

export type SortDataType = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number,
    blogId?: string
}

export type BlogIdParams = {
    blogId: string
}

export type PostIdParams = {
    postId: string
}

export type UserIdParams = {
    id: any
    userId: string
}

export interface ResultCodeHandler<T> {
    success: boolean
    data: T | null
    error?: string
}

export const resultCodeMap = <T>(success: boolean, data: T, error?: string) => {
    return {
        success: success,
        data: data,
        error: error
    }
}