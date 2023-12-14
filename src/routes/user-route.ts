import {Router, Response} from "express";
import {Params, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/common";
import {UserSortDataType} from "../types/user/output";
import {QueryUserRepository} from "../repositories/query-repository/query-user-repository";
import {authLoginValidation} from "../validators/auth-validator";
import {userValidation} from "../validators/user-validator";
import {InputUserType} from "../types/user/input";
import {UserService} from "../domain/user-service";
import {ObjectId} from "mongodb";
import {UserRepository} from "../repositories/user-repository";

export const userRoute = Router({})

userRoute.get('/', authLoginValidation(), userValidation(), async (req: RequestWithQuery<UserSortDataType>, res: Response) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm
    }
    const users = await QueryUserRepository.getAllUsers(sortData)

    if(!users){
        res.sendStatus(404)
        return
    }
    res.status(200).send(users)
    return
})

userRoute.post('/', authLoginValidation(), userValidation(), async (req: RequestWithBody<InputUserType>, res: Response) => {

    const user = await UserService.createUser(req.body)

    return res.status(201).send(user)
})

userRoute.delete('/:id', authLoginValidation(), async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id
    if (!id || ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    const status = await UserRepository.deleteUserById(id)

    if (!status){
        res.sendStatus(404)
        return
    }
    return res.sendStatus(204)
})
