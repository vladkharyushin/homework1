import dotenv from 'dotenv'
dotenv.config()

export const mongoUrl = process.env.MONGO_URL as string

export const JWT_SECRET = process.env.JWT_SECRET || '123'

export const MAIL_RU_PASS = process.env.MAIL_RU_PASS