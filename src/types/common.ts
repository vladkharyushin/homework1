import {Request} from "express";

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