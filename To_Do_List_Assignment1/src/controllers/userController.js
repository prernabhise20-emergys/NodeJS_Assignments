const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constantDetails = require('../constants/constant')
const userModel = require('../models/userModel')
require('dotenv').config();



const register = async (req, res) => {
    try {

        const { username, password, name, contact_no } = req.body;

        await userModel.createUser(username, password, name, contact_no);

        res.status(201).json({ message: 'User registered successfully' });

    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// *************************************************************

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findUserByUsername(username);

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

// **************************************************************

const updateUser = async (req, res) => {
    try {
        const { username, password, name, contact_no } = req.body;
        const userId = req.params.id;

        const userExists = await userModel.checkIfUserExists({ username });

        if (userExists) {
            return res.status(500).send({
                status: constantDetails.ERROR.STATUS_CODE,
                message: "User with similar details already exists.",
            });
        }

        const updateUserResult = await userModel.updateUser({ username, password, name, contact_no, userId });

        if (updateUserResult.affectedRows === 0) {
            return res.status(404).send({
                STATUS_CODE: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }

        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *************************************************************************

const getAllUser = async (req, res) => {
    try {
        const tasks = await userModel.getAllUser();
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks
        });
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        const deleteUser = await userModel.deleteUser(userId);

        if (deleteUser.affectedRows === 0) {
            res.status(404).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            user: deleteUser
        });

    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};


module.exports = {
    register,
    login,
    updateUser,
    getAllUser,
    deleteUser
};
