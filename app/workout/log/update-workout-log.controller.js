import asyncHandler from 'express-async-handler';

import { prisma } from '../../../server.js';

/**
 * @desc Обновление состояния лога тренировки по id
 * @route PATCH /api/workouts/log/complete/:id
 * @access Private
 */
export const updateWorkoutLogCompleteById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { isCompleted } = req.body;

    try {
        const workoutLog = await prisma.workoutLog.update({
            where: { id },
            data: { isCompleted },
            include: {
                workout: true,
                exerciseLogs: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });
        res.json(workoutLog);
    } catch (error) {
        res.status(400);
        throw new Error('При обновлении лога произошла ошибка');
    }
});
