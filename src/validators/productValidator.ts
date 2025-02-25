import { body, validationResult } from 'express-validator';
import {NextFunction, Request, Response} from "express";

export const createProductValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category_id').isInt().withMessage('Category ID must be an integer'),
    body('quantity').isInt().withMessage('Quantity must be an integer'),
    body('price').isFloat().withMessage('Price must be a number'),
];

export const updateProductValidator = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
    body('quantity').optional().isInt().withMessage('Quantity must be an integer'),
    body('price').optional().isFloat().withMessage('Price must be a number'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};