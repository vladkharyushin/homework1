export type UserType = {
    id?: string
    login: string
    email: string
    createdAt: string
    passwordHash: string
    passwordSalt: string
}

export type UserSortDataType = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export type OutputUserType = {
    id: string
    login: string
    email: string
    createdAt: string
}