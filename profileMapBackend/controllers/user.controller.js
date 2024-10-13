import User from '../models/user.model.js';

const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.set(req.body);
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if ID is provided
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const getLocations = async (req, res) => {
    try {
        const locations = await User.find().distinct('address');
        res.json(locations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


export { fetchAllUsers, fetchUserById, createUser, updateUser, deleteUser, getLocations };