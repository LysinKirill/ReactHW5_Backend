import { Request, Response, NextFunction } from 'express';
import {getUserFromRequest, verifyAccessToken} from '../utils/jwt';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            verifyAccessToken(token);
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid or expired token'});
            return;
        }
    } else {
        res.status(401).json({ error: 'Authorization header required' });
        return;
    }
};

export const checkGroupPermission = (requiredGroups: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = getUserFromRequest(req);
        if (!user) {
            res.status(403).json({ error: 'Not permissions found for user' });
            return;
        }
        if (requiredGroups.includes('admin') && user.group === 'admin') {
            return next();
        }

        if (requiredGroups.includes(user.group)) {
            return next();
        }

        res.status(403).json({ error: 'Not enough permissions to perform this action' });
        return;
    };
};