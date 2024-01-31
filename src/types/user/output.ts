import {ObjectId, WithId} from "mongodb";

export type UserSortDataType = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export type UserType = {
    _id?: ObjectId
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type UserDbType = WithId<{
    login: string
    email: string
    createdAt: Date
    passwordHash: string
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}>

export type OutputUserType = {
    id: string
    login: string
    email: string
    createdAt: string
}