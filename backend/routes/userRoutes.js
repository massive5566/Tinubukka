import express from 'express';
const router = express.Router();
import {
	authUser,
	deleteUser,
	getUserById,
	getUserProfile,
	getUsers,
	registerUser,
	updateUser,
	updateUserProfile,
} from '../controlers/userControler.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

router.post('/login', authUser);

router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);

router.route('/').post(registerUser).get(protect, isAdmin, getUsers);
router
	.route('/:id')
	.delete(protect, isAdmin, deleteUser)
	.get(protect, isAdmin, getUserById)
	.put(protect, isAdmin, updateUser);

export default router;
