import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const notFoundValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = errors.array({ onlyFirstError: true });

        return res.sendStatus(404);
    }
    return next();
};