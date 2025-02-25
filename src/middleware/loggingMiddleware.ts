import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[INFO]: ${req.method} ${req.url}`);
    next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[ERROR]:', error);
    next(error);
};