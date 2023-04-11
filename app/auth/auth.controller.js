import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import asyncHandler from 'express-async-handler';

import { prisma } from '../../server.js';

import { UserFields } from './auth.constants.js';
import { generateToken } from './tools/generate-token.js';

/**
 * @desc Авторизация пользователя
 * @route POST /api/auth/login
 * @access Public
 */
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    const isPasswordValid = await verify(user.password, password);

    if (user && isPasswordValid) {
        const token = generateToken(user.id);
        res.json({ token });
    } else {
        res.status(403);
        throw new Error('Неверный логин или пароль');
    }
});

/**
 * @desc Регистрация пользователя
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (isUserExist) {
        res.status(400);
        throw new Error('Такой пользователь уже есть');
    }

    const user = await prisma.user.create({
        data: {
            email,
            password: await hash(password),
            name: faker.name.fullName(),
        },
        select: UserFields,
    });

    const token = generateToken(user.id);

    res.json({ user, token });
});
