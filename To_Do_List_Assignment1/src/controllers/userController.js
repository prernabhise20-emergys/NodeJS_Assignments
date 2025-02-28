const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constantDetails = require('../constants/statusConstant')
const userModel = require('../models/userModel');
const { use } = require('../routes/taskRoute');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, password, name, contact_no, email } = req.body;

        await userModel.createUser(username, password, name, contact_no, email);

        res.status(constantDetails.CREATED.STATUS_CODE).json({
            status: constantDetails.CREATED.STATUS_CODE,
            message: constantDetails.REGISTER.MESSAGE
        });

    }
    catch (error) {
        console.error(error.message);

        res.status(constantDetails.ERROR.STATUS_CODE).json({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE,
            errorMessage: error.message || constantDetails.UNEXPECTED_ERROR.MESSAGE

        });
    }
};

// *************************************************************

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.login(username);

        if (!user) {
            return res.status(constantDetails.INVALID_USER.STATUS_CODE).json({
                status: constantDetails.INVALID_USER.STATUS_CODE,
                message: constantDetails.INVALID_USER.MESSAGE
            });
        }

        const match = await bcrypt.compare(password, user.PASSWORD);

        if (!match) {
            return res.status(constantDetails.INVALID_USER.STATUS_CODE).json({
                status: constantDetails.INVALID_USER.STATUS_CODE,
                message: constantDetails.INVALID_USER.MESSAGE
            });
        }

        const token = jwt.sign(
            { id: user.USERID, username: user.USERNAME, email: user.EMAIL },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );


        res.json({ message: constantDetails.LOGIN.MESSAGE, token });
    } catch (error) {
        console.error(error.message)
        res.status(constantDetails.ERROR.STATUS_CODE).json({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE,
            errorMessage: error.message || constantDetails.UNEXPECTED_ERROR.MESSAGE

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
            return res.status(500).send({
                status: constantDetails.ERROR.STATUS_CODE,
                message: constantDetails.DUPLICATE.MESSAGE,
            });
        }

            const updateUserResult = await userModel.updateUser(formData, uid);

        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });
    } catch (error) {
        console.error(error.message)
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE,
            errorMessage: error.message || constantDetails.UNEXPECTED_ERROR.MESSAGE

        });
    }
};

// *************************************************************************

const getUser = async (req, res) => {
    try {
        const { id: userId } = req.user

        const tasks = await userModel.getUser(userId);
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks
        });
    } catch (error) {
        console.error(error.message)
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE,
            errorMessage: error.message || constantDetails.UNEXPECTED_ERROR.MESSAGE

        });
    }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
    try {

        const { id: userId } = req.user

            const deleteUser = await userModel.deleteUser(userId);
       
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            user: deleteUser
        });

    } catch (error) {
        console.error(error.message)
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE,
            errorMessage: error.message || constantDetails.UNEXPECTED_ERROR.MESSAGE

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
