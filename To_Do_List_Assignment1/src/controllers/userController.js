const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {message,status} = require("../constants/statusConstant")
const userModel = require('../models/userModel');
const { use } = require('../routes/taskRoute');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, password, name, contact_no, email } = req.body;

        await userModel.createUser(username, password, name, contact_no, email);

        res.status(status.CREATED).json({
            status: status.CREATED,
            message: message.CREATED_MESSAGE
        });

    }
    catch (error) {
        console.error(error.message);

        res.status(status.SERVER_ERROR).json({
            status: status.SERVER_ERROR,
            message: message.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || message.UNEXPECTED_ERROR

        });
    }
};

// *************************************************************

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.login(username);

        if (!user) {
            return res.status(status.INVALID).json({
                status: status.INVALID,
                message: message.INVALID_USER_MESSAGE
            });
        }

        const match = await bcrypt.compare(password, user.PASSWORD);

        if (!match) {
            return res.status(status.INVALID).json({
                status: status.INVALID,
                message: message.INVALID_USER_MESSAGE
            });
        }

        const token = jwt.sign(
            { id: user.USERID, username: user.USERNAME, email: user.EMAIL },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );


        res.json({ message: message.LOGIN_SUCCESS_MESSAGE, token });
    } catch (error) {
        console.error(error.message)
        res.status(status.SERVER_ERROR).json({
            status: status.SERVER_ERROR,
            message:  message.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || message.UNEXPECTED_ERROR

        });
    }
};

// **************************************************************

const updateUser = async (req, res) => {
    try {
        const formData = req.body;
        const { id: uid } = req.user

        const userExists = await userModel.checkIfUserExists(formData.username);

        if (userExists) {
            return res.status(status.SERVER_ERROR).send({
                status: status.SERVER_ERROR,
                message: message.INVALID_USER_MESSAGE,
            });
        }

            const updateUserResult = await userModel.updateUser(formData, uid);

        return res.status(status.SUCCESS).send({
            status: status.SUCCESS,
            message: message.SUCCESS_MESSAGE
        });
    } catch (error) {
        console.error(error.message)
        return res.status(status.SERVER_ERROR).send({
            status: status.SERVER_ERROR,
            message:  message.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || message.UNEXPECTED_ERROR

        });
    }
};

// *************************************************************************

const getUser = async (req, res) => {
    try {
        const { id: userId } = req.user

        const tasks = await userModel.getUser(userId);
        return res.status(status.SUCCESS).send({
            status: status.SUCCESS,
            message: message.SUCCESS_MESSAGE,
            data: tasks
        });
    } catch (error) {
        console.error(error.message)
        return res.status(status.SERVER_ERROR).send({
            status: status.SERVER_ERROR,
            message:  message.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || message.UNEXPECTED_ERROR

        });
    }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
    try {

        const { id: userId } = req.user

            const deleteUser = await userModel.deleteUser(userId);
       
        return res.status(status.SUCCESS).send({
            status: status.SUCCESS,
            message: message.SUCCESS_MESSAGE,
            user: deleteUser
        });

    } catch (error) {
        console.error(error.message)
        return res.status(status.SERVER_ERROR).send({
            status: status.SERVER_ERROR,
            message:  message.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || message.UNEXPECTED_ERROR

        });
    }
};


module.exports = {
    register,
    login,
    updateUser,
    getUser,
    deleteUser
};
