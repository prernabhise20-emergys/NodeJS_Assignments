const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {MESSAGE,STATUS_CODE} = require("../constants/statusConstant")
const userModel = require('../models/userModel');
// const { use } = require('../routes/taskRoute');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, password, name, contact_no, email } = req.body;
        
    const userExists = await userModel.checkIfUserExists(username, password, contact_no, email);
    if (userExists) {
        return res.status(STATUS_CODE.BAD_REQUEST).send({
          status: STATUS_CODE.BAD_REQUEST,
          message: MESSAGE.DUPLICATE_ERROR_MESSAGE,
        });
      }

        await userModel.createUser(username, password, name, contact_no, email);

        res.status(STATUS_CODE.CREATED).json({
            status: STATUS_CODE.CREATED,
            message: MESSAGE.CREATED_MESSAGE
        });

    }
    catch (error) {
        console.error(error.message);

        res.status(STATUS_CODE.SERVER_ERROR).json({
            status: STATUS_CODE.SERVER_ERROR,
            message: MESSAGE.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR

        });
    }
};

// *************************************************************

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.login(username);

        if (!user) {
            return res.status(STATUS_CODE.INVALID).json({
                status: STATUS_CODE.INVALID,
                message: MESSAGE.INVALID_USER_MESSAGE
            });
        }

        const match = await bcrypt.compare(password, user.PASSWORD);

        if (!match) {
            return res.status(STATUS_CODE.INVALID).json({
                status: STATUS_CODE.INVALID,
                message:MESSAGE.INVALID_USER_MESSAGE
            });
        }

        const token = jwt.sign(
            { id: user.USERID, username: user.USERNAME, email: user.EMAIL },
            process.env.SECRET_KEY,
            { expiresIn: '3h' }
        );


        res.json({ message:MESSAGE.LOGIN_SUCCESS_MESSAGE, token });
    } catch (error) {
        console.error(error.message)
        res.status(STATUS_CODE.SERVER_ERROR).json({
            status: STATUS_CODE.SERVER_ERROR,
            message:  MESSAGE.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR

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
            return res.status(STATUS_CODE.SERVER_ERROR).send({
                status: STATUS_CODE.SERVER_ERROR,
                message:MESSAGE.INVALID_USER_MESSAGE,
            });
        }

            const updateUserResult = await userModel.updateUser(formData, uid);

        return res.status(STATUS_CODE.SUCCESS).send({
            status: STATUS_CODE.SUCCESS,
            message: MESSAGE.SUCCESS_MESSAGE
        });
    } catch (error) {
        console.error(error.message)
        return res.status(STATUS_CODE.SERVER_ERROR).send({
            status:STATUS_CODE.SERVER_ERROR,
            message: MESSAGE.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR

        });
    }
};

// *************************************************************************

const getUser = async (req, res) => {
    try {
        const { id: userId } = req.user

        const tasks = await userModel.getUser(userId);
        return res.status(STATUS_CODE.SUCCESS).send({
            status: STATUS_CODE.SUCCESS,
            message: MESSAGE.SUCCESS_MESSAGE,
            data: tasks
        });
    } catch (error) {
        console.error(error.message)
        return res.status(STATUS_CODE.SERVER_ERROR).send({
            status: STATUS_CODE.SERVER_ERROR,
            message:  MESSAGE.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR

        });
    }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
    try {

        const { id: userId } = req.user

            const deleteUser = await userModel.deleteUser(userId);
       
        return res.status(STATUS_CODE.SUCCESS).send({
            status: STATUS_CODE.SUCCESS,
            message: MESSAGE.SUCCESS_MESSAGE,
            user: deleteUser
        });

    } catch (error) {
        console.error(error.message)
        return res.status(STATUS_CODE.SERVER_ERROR).send({
            status: STATUS_CODE.SERVER_ERROR,
            message:  MESSAGE.SERVER_ERROR_MESSAGE,
            errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR

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
