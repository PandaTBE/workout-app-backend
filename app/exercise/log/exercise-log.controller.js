import asyncHandler from 'express-async-handler';

import { prisma } from '../../../server.js';

/**
 * @desc Создание лога для упражнения
 * @route POST /api/exercises/log/:exerciseId
 * @access Private
 */
export const createNewExerciseLog = asyncHandler(async (req, res) => {
    const exerciseId = Number(req.params.exerciseId);

    const exercise = await prisma.exercise.findUnique({
        where: {
            id: exerciseId,
        },
    });

    if (!exercise) {
        res.status(404);
        throw new Error(`Упражнение с id ${exerciseId} не найдено`);
    }

    const exerciseTimes = [];

    for (let i = 0; i < exercise.times; i++) {
        exerciseTimes.push({ weight: 0, repeat: 0 });
    }

    const exerciseLog = await prisma.exerciseLog.create({
        data: {
            user: {
                connect: {
                    id: req.user.id,
                },
            },
            exercise: {
                connect: {
                    id: exerciseId,
                },
            },
            times: {
                createMany: {
                    data: exerciseTimes,
                },
            },
        },
        include: {
            times: true,
        },
    });

    res.json(exerciseLog);
});
