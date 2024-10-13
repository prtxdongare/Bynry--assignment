import express from 'express';
const router = express.Router();

import { fetchAllUsers, fetchUserById, createUser, updateUser, deleteUser, getLocations } from '../controllers/user.controller.js';

router.get('/profiles', fetchAllUsers);
router.get('/profile/:id', fetchUserById);
router.get('/locations',getLocations);
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/', (req, res) => {
    res.send('Welcome to Profile Map API');
});
router.get('/health', (req, res) => {
    res.send('API is healthy');
});

export default router;