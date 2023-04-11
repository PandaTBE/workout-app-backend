import asyncHandler from 'express-async-handler';

import { prisma } from '../../../server.js';

/**
 * @desc Обновление подхода по id
 * @route PATCH /api/exercises/log/time/:id
 * @access Private
 */
export const updateExerciseLogTimeById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    try {
        const exerciseLogTime = await prisma.exerciseTime.update({
            where: { id },
            data: body,
        });

        res.json(exerciseLogTime);
    } catch (error) {
        res.status(400);
        throw new Error('Ошибка при обновлении подхода');
    }
});

/**
 * @desc Обновление лога упражнения по id
 * @route PATCH /api/exercises/log/complete/:id
 * @access Private
 */
export const updateExerciseLogCompleteById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { isCompleted } = req.body;

    try {
        const exerciseLog = await prisma.exerciseLog.update({
            where: { id },
            data: { isCompleted },
            include: { times: true, exercise: true },
        });
        res.json(exerciseLog);
    } catch (error) {
        res.status(400);
        throw new Error('Ошибка при обновлении лога упражнения');
    }
});
