import asyncHandler from 'express-async-handler';

import { prisma } from '../../../server.js';

/**
 * @desc Получение лога тренировки по id
 * @route POST /api/workouts/log/:id
 * @access Private
 */
export const getWorkoutLogById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const workoutLog = await prisma.workoutLog.findUnique({
        where: { id },
        include: {
            workout: true,
            exerciseLogs: true,
        },
    });

    if (!workoutLog) {
        res.status(404);
        throw new Error('Лог тренировки не найден');
    }

    res.json(workoutLog);
});
