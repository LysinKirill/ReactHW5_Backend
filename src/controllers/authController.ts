import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from '../utils/jwt';
import pool from '../models/db';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: 'Incorrect credentials'});
            return;
        }

        const userPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            group: user.group,
            avatar_url: user.avatar_url
        };

        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
            [user.id, refreshToken]
        );

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.json({
            accessToken,
            user: userPayload
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            res.status(401).json({ error: 'No refresh token provided' });
            return;
        }

        const { id } = verifyRefreshToken(refreshToken);

        const tokenResult = await pool.query(
            'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
            [refreshToken, id]
        );

        if (!tokenResult.rows[0]) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = userResult.rows[0];

        const userPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            group: user.group,
            avatar_url: user.avatar_url
        };

        const newAccessToken = generateAccessToken(userPayload);

        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
};


export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, group = 'user', avatar_url=null } = req.body;

        if (!username || !email || !password) {
            res.status(401).json({ error: 'Incorrect credentials: missing required fields'});
            return;
        }

        const userExists = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (userExists.rows.length > 0) {
            res.status(409).json({error: 'Email or username already exists'})
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, "group", avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
            [username, email, hashedPassword, group, avatar_url]
        );

        res.status(201).json({
            id: newUser.rows[0].id,
            username: newUser.rows[0].username,
            email: newUser.rows[0].email,
            group: newUser.rows[0].group,
            avatar_url: newUser.rows[0].avatar_url,
        });
    } catch (error) {
        next(error);
    }
};