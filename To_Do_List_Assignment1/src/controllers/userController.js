const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
} = require("../constants/statusConstant");
const userModel = require("../models/userModel");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, password, name, contact_no, email } = req.body;

    const userExists = await userModel.checkIfUserExists(email);
    if (userExists) {
      throw {
        status: ERROR_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.DUPLICATE_USER_MESSAGE,
      };
    }

    await userModel.createUser(username, password, name, contact_no, email);

    res.status(SUCCESS_STATUS_CODE.CREATED).json({
      status: SUCCESS_STATUS_CODE.CREATED,
      message: SUCCESS_MESSAGE.REGISTER_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).json({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *************************************************************
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.login(username);

    if (!user) {
      throw {
        status: ERROR_STATUS_CODE.INVALID,
        message: ERROR_MESSAGE.INVALID_USER_MESSAGE,
      };
    }
    console.log("Plain password:", password);
    console.log("Hashed password from DB:", user.password);
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw {
        status: ERROR_STATUS_CODE.INVALID,
        message: ERROR_MESSAGE.INVALID_USER_MESSAGE,
      };
    }

    const token = jwt.sign(
      { id: user.userid, username: user.username, email: user.email, status:user.status },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.json({ message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE, token });
  } catch (error) {
    console.error(error.message);
    res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).json({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// **************************************************************

const updateUser = async (req, res) => {
  try {
    const formData = req.body;

    const userExists = await userModel.checkIfUserExists(formData.email);

    if (!userExists) {
      throw {
        status: ERROR_STATUS_CODE.SERVER_ERROR,
        message: ERROR_MESSAGE.INVALID_USER_MESSAGE,
      };
    }
    const { id: uid } = req.user;

    console.log(uid);

    await userModel.updateUser(formData, uid);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.USER_UPDATE_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *************************************************************************

const getUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const tasks = await userModel.getUser(userId);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.GET_USER_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *******************************************************************************

const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const deleteUser = await userModel.deleteUser(userId);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.DELETE_USER_MESSAGE,
      user: deleteUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
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
