import { Request, Response, NextFunction } from 'express';
import { DatabaseError } from '../utils/dbErrorHandler';

export const errorHandler = (error: Error, req: Request, res: Response, _: NextFunction) => {
    console.log('Error:', error);

    if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
    }

    if (error.name === 'NotFoundError') {
        res.status(404).json({ error: error.message });
        return;
    }

    if (error instanceof DatabaseError) {
        if (error.code === 'CATEGORY_NOT_FOUND') {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        if (error.code === 'RESOURCE_EXISTS') {
            res.status(400).json({ error: 'Resource already exists' });
            return;
        }
    }

    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
};