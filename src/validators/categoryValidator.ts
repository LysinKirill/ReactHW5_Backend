import { body, validationResult } from 'express-validator';
import {NextFunction, Request, Response} from "express";

export const createCategoryValidator = [
    body('name').notEmpty().withMessage('Name is required'),
];

export const updateCategoryValidator = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};