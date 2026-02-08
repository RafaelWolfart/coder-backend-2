import { Router } from 'express';
import authRouter from './auth.router.js';
import userRouter from './user.router.js';
import studentRouter from './student.router.js';
import homeRouter from './home.router.js';

const router = Router();

// Rutas de autenticación
router.use('/sessions', authRouter);

// Rutas de API
router.use('/api/users', userRouter);
router.use('/api/students', studentRouter);

// Rutas principales
router.use('/', homeRouter);

export default router;
