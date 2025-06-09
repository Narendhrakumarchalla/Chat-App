import express, { Router } from 'express'
import { checkAuth, Login, SignUp, updateProfile } from '../controller/userControllers.js';
import { authUser } from '../middleware/auth.js';

const userRoutes = Router();

userRoutes.post('/login', Login)
userRoutes.post('/signup', SignUp)
userRoutes.put('/update-profile', authUser , updateProfile)
userRoutes.get('/check', authUser, checkAuth)

export default userRoutes