import asyncHandler from 'express-async-handler';

import { prisma } from '../../server.js';

/**
 * @desc Создание тренировки
 * @route POST /api/workouts
 * @access Private
 */
export const createNewWorkout = asyncHandler(async (req, res) => {
    const { name, exerciseIds } = req.body;

    const workout = await prisma.workout.create({
        data: {
            name,
            exercises: {
                connect: exerciseIds.map((id) => ({ id: Number(id) })),
            },
        },
        include: {
            exercises: true,
            workoutLogs: true,
        },
    });

    res.json(workout);
});

/**
 * @desc Получение всех тренировок
 * @route GET /api/workouts
 * @access Private
 */
export const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await prisma.workout.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
            exercises: true,
            workoutLogs: true,
        },
    });
    res.json(workouts);
});

/**
 * @desc Получение тренировки по Id
 * @route GET /api/workouts/:id
 * @access Private
 */
export const getWorkoutById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const workout = await prisma.workout.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            exercises: true,
            workoutLogs: true,
        },
    });

    if (!workout) {
        res.status(404);
        throw new Error(`Тренировка с id ${id} не найдена`);
    }
    res.json(workout);
});

/**
 * @desc Обновление тренировки по id
 * @route PUT /api/workouts/:id
 * @access Private
 */
export const updateWorkoutById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, exerciseIds } = req.body;

    try {
        const workout = await prisma.workout.update({
            where: { id: Number(id) },
            data: {
                name,
                exercises: {
                    set: exerciseIds?.map((id) => ({ id: Number(id) })),
                },
            },
            include: {
                exercises: true,
                workoutLogs: true,
            },
        });

        res.json(workout);
    } catch (_) {
        res.status(404);
        throw new Error(`Тренировка с id ${id} не найдена`);
    }
});

/**
 * @desc Удаление тренировки по id
 * @route DELETE /api/workouts/:id
 * @access Private
 */
export const deleteWorkoutById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.workout.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Тренировка удалена!' });
    } catch (_) {
        res.status(404);
        throw new Error(`Тренировка с id ${id} не найдена`);
    }
});
