import {Request, Response, NextFunction} from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error:', error);

    if (error.name === 'ValidationError') {
        res.status(400).json({error: error.message});
        return;
    }

    if (error.name === 'NotFoundError') {
        res.status(404).json({error: error.message});
        return;
    }

    console.error('Internal Server Error:', error);
    res.status(500).json({error: 'Internal Server Error'});
};
