import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import express from "express";

config();

const ACCESS_TOKEN_SECRET = "f71aa2a12ec2ba7c5623924c0d460f1e1e993317533eace17067ebf8e0804ae3";
const REFRESH_TOKEN_SECRET = "f71aa2a12ec2ba7c5623924c0d460f1e1e993317533eace17067ebf8e0804ae3";

interface UserPayload {
    id: number;
    username: string;
    email: string;
    group: string;
    avatar_url?: string;
}

export const generateAccessToken = (user: UserPayload) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
        algorithm: 'HS256'
    });
};

export const generateRefreshToken = (user: UserPayload) => {
    return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
};

export const getUserFromToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as UserPayload;
};

export const getUserFromRequest = (request: express.Request) => {
    const authHeader = request.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        return getUserFromToken(token);
    }
    return null;
}

export const verifyAccessToken = (token: string) => {
    getUserFromToken(token)
};


export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: number };
};