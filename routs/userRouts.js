import express from 'express';
import { addUser, getAllUsers, login } from '../controller/userController.js';
import { authAdmin } from '../middleware/auth.js';

const router=express.Router();

router.post('/',addUser);
router.post('/login',login);
router.get('/',authAdmin,getAllUsers);

export default router;