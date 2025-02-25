const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constantDetails = require('../constants/statusConstant')
const userModel = require('../models/userModel')
require('dotenv').config();


const register = async (req, res) => {
    try {

        const { username, password, name, contact_no } = req.body;

        await userModel.createUser(username, password, name, contact_no);

        res.status(constantDetails.CREATED.STATUS_CODE).json({
            status: constantDetails.CREATED.STATUS_CODE,
            message: constantDetails.REGISTER.MESSAGE
        });

    }
    catch (error) {
        res.status(constantDetails.ERROR.STATUS_CODE).json({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *************************************************************

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findUserByUsername(username);

        if (!user) {
            return res.status(constantDetails.INVALID_USER.STATUS_CODE).json({
                status: constantDetails.INVALID_USER.STATUS_CODE,
                message: constantDetails.INVALID_USER.MESSAGE
            });
        }

        const isMatch = await bcrypt.compare(password, user.PASSWORD);
        if (!isMatch) {
            return res.status(constantDetails.INVALID_USER.STATUS_CODE).json({
                status: constantDetails.INVALID_USER.STATUS_CODE,
                message: constantDetails.INVALID_USER.MESSAGE
            });
        }

        const token = jwt.sign(
            { id: user.USERID, username: user.USERNAME},
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );


        res.json({ message: constantDetails.LOGIN.MESSAGE, token });
    } catch (error) {
        res.status(constantDetails.ERROR.STATUS_CODE).json({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// **************************************************************

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const formData = req.body;
        formData.userId = userId;

        const userExists = await userModel.checkIfUserExists(formData.username);

        if (userExists) {
            return res.status(500).send({
                status: constantDetails.ERROR.STATUS_CODE,
                message: constantDetails.DUPLICATE.MESSAGE,
            });
        }

        const updateUserResult = await userModel.updateUser(formData,userId);

        if (updateUserResult.affectedRows === 0) {
            return res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                STATUS_CODE: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            });
        }

        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *************************************************************************

const getAllUser = async (req, res) => {
    try {
        const tasks = await userModel.getAllUser();
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks
        });
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deleteUser = await userModel.deleteUser(userId);

        if (deleteUser.affectedRows === 0) {
            res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            user: deleteUser
        });

    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
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
