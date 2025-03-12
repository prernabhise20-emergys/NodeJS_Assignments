const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { MESSAGE, STATUS_CODE } = require("../constants/statusConstant");
const userModel = require("../models/userModel");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, password, name, contact_no, email } = req.body;

    const userExists = await userModel.checkIfUserExists(email);
    if (userExists) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.DUPLICATE_USER_MESSAGE,
      });
    }

    await userModel.createUser(username, password, name, contact_no, email);

    res.status(STATUS_CODE.CREATED).json({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.REGISTER_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    res.status(STATUS_CODE.SERVER_ERROR).json({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
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
        message: MESSAGE.INVALID_USER_MESSAGE,
      });
    }
    console.log("Plain password:", password);
    console.log("Hashed password from DB:", user.password);
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(STATUS_CODE.INVALID).json({
        status: STATUS_CODE.INVALID,
        message: MESSAGE.INVALID_USER_MESSAGE,
      });
    }

    const token = jwt.sign(
      { id: user.userid, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.json({ message: MESSAGE.LOGIN_SUCCESS_MESSAGE, token });
  } catch (error) {
    console.error(error.message);
    res.status(STATUS_CODE.SERVER_ERROR).json({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// **************************************************************

const updateUser = async (req, res) => {
  try {
    const formData = req.body;

    const userExists = await userModel.checkIfUserExists(formData.email);

    if (!userExists) {
      return res.status(STATUS_CODE.SERVER_ERROR).send({
        status: STATUS_CODE.SERVER_ERROR,
        message: MESSAGE.INVALID_USER_MESSAGE,
      });
    }
    const { id: uid } = req.user;

    console.log(uid);

    await userModel.updateUser(formData, uid);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.USER_UPDATE_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// *************************************************************************

const getUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const tasks = await userModel.getUser(userId);
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.GET_USER_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const deleteUser = await userModel.deleteUser(userId);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_USER_MESSAGE,
      user: deleteUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  getUser,
  deleteUser,
};
