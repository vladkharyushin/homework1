export interface IUserDB {
    id?: string
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: string
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}