import { PrismaClient } from '@prisma/client';
import 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import { errorHandler, notFound } from './app/middleware/error.middleware.js';

import authRoutes from './app/auth/auth.routes.js';
import exerciseRoutes from './app/exercise/exercise.routes.js';
import userRoutes from './app/user/user.routes.js';
import workoutRoutes from './app/workout/workout.routes.js';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5050;

async function main() {
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    const __dirname = path.resolve();

    app.use(cors());
    app.use(express.json());

    app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    app.use('/api/exercises', exerciseRoutes);
    app.use('/api/workouts', workoutRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(
            `Server running in ${process.env.NODE_ENV} on port ${PORT}`.green
                .bold,
        );
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
