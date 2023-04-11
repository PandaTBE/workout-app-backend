import asyncHandler from 'express-async-handler';

import { prisma } from '../../../server.js';

import { addPrevValues } from './tools/add-prev-values.js';

/**
 * @desc Получение лога по id
 * @route GET /api/exercises/log/:id
 * @access Private
 */
export const getExerciseLogById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const exerciseLog = await prisma.exerciseLog.findUnique({
        where: {
            id,
        },
        include: {
            exercise: true,
            times: {
                orderBy: {
                    id: 'asc',
                },
            },
        },
    });

    if (!exerciseLog) {
        res.status(404);
        throw new Error(`Лог упражнения с id: ${id} не найден`);
    }

    const prevExerciseLog = await prisma.exerciseLog.findFirst({
        where: {
            userId: req.user.id,
            isCompleted: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            times: true,
        },
    });

    const newTimes = addPrevValues(exerciseLog, prevExerciseLog);

    res.json({ ...exerciseLog, times: newTimes });
});
