import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import { prisma } from '../../server.js';

/**
 * middleware для проверки переданного токена
 */
export const protect = asyncHandler(async (req, res, next) => {
    let token = null;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        if (!decoded) {
            res.status(403);
            throw new Error('Ошибка авторизации: неверный токен авторизации!');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            res.status(403);
            throw new Error('Ошибка авторизации: неверный токен авторизации!');
        }

        req.user = user;
        next();
    } else {
        res.status(401);
        throw new Error(
            'Ошибка авторизации: не был передан токен авторизации!',
        );
    }

    if (!token) {
        res.status(401);
        throw new Error(
            'Ошибка авторизации: не был передан токен авторизации!',
        );
    }
});
