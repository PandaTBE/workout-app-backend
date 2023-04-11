import asyncHandler from 'express-async-handler';

import { prisma } from '../../server.js';
import { UserFields } from '../auth/auth.constants.js';
import { calculateMinutes } from '../tools/calculate-minutes.js';

/**
 * @desc Получение информации о пользователе
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: UserFields,
    });

    if (!user) {
        res.status(404);
        throw new Error('Ошибка при получении данных пользователя');
    }

    const totalWorkouts = await prisma.workoutLog.count({
        where: {
            userId: user.id,
            isCompleted: true,
        },
    });

    const completedExercises = await prisma.exerciseLog.count({
        where: {
            userId: user.id,
            isCompleted: true,
        },
    });

    const totalWeight = await prisma.exerciseTime.aggregate({
        where: {
            exerciseLog: {
                userId: user.id,
            },
            isCompleted: true,
        },
        _sum: {
            weight: true,
        },
    });

    const statistics = {
        totalWorkouts,
        totalMinutes: calculateMinutes(completedExercises),
        totalWeight: totalWeight._sum.weight || 0,
    };

    res.json({ user, statistics });
});
