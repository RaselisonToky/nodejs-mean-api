import express from 'express';
import userController from './user.controller.js';

const router = express.Router();
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/role/:id', userController.getUsersByRole);

export default router;
