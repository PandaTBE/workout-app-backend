import asyncHandler from 'express-async-handler';

import { prisma } from '../../../server.js';

/**
 * @desc Создание лога для тренировки
 * @route POST /api/workouts/log/:workoutId
 * @access Private
 */
export const createNewWorkoutLog = asyncHandler(async (req, res) => {
    const workoutId = Number(req.params.workoutId);

    const workout = await prisma.workout.findUnique({
        where: {
            id: workoutId,
        },
        include: {
            exercises: true,
        },
    });

    if (!workout) {
        res.status(404);
        throw new Error(`Тренировка с id: ${workoutId} не найдена`);
    }

    try {
        const workoutLog = await prisma.workoutLog.create({
            data: {
                user: {
                    connect: {
                        id: req.user.id,
                    },
                },
                workout: {
                    connect: {
                        id: workoutId,
                    },
                },
                exerciseLogs: {
                    create: workout.exercises.map((element) => {
                        return {
                            user: {
                                connect: {
                                    id: req.user.id,
                                },
                            },
                            exercise: {
                                connect: {
                                    id: element.id,
                                },
                            },
                            times: {
                                create: Array.from(
                                    { length: element.times },
                                    () => ({
                                        weight: 0,
                                        repeat: 0,
                                    }),
                                ),
                            },
                        };
                    }),
                },
            },
            include: {
                exerciseLogs: true,
                workout: true,
            },
        });

        res.json(workoutLog);
    } catch (error) {
        res.status(400);
        throw new Error(`Ошибка при создании лога для тренировки`);
    }
});
