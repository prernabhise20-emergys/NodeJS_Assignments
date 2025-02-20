const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByUsername } = require('../models/userModel');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, password, name, contact_no } = req.body;
        await createUser(username, password, name, contact_no);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.PASSWORD);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.USERID, username: user.USERNAME },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        console.log('Generated Token:', token);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
