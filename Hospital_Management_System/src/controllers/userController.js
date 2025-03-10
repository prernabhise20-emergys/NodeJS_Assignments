import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendVerificationEmail from '../utility/sendVerficationEmail.js';
import{createUserData,checkIfUserExists,loginUser, getUserData, updateUserData,deleteUserData} from '../models/userModel.js';
import { MESSAGE, STATUS_CODE } from '../constants/statusConstant.js';
dotenv.config();


const register = async (req, res) => {
  try {
    const { email, user_password, first_name, last_name, mobile_number } = req.body;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        status:STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.ALREADY_REGISTER,
      });
    }

    await createUserData(email, user_password, first_name, last_name, mobile_number);

    await sendVerificationEmail(email);  

    res.status(STATUS_CODE.CREATED).json({
      status: STATUS_CODE.CREATED,
      message:MESSAGE.REGISTER_SUCCESS,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.ERROR).send({
      status: STATUS_CODE.ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


// *************************************************************

const login = async (req, res) => {
  try {
      const { email, user_password } = req.body;

      const user = await loginUser(email);

      if (!user) {
          return res.status(STATUS_CODE.INVALID).json({
              status: STATUS_CODE.INVALID,
              message: MESSAGE.INVALID_USER_MESSAGE
          });
      }

      const match = await bcrypt.compare(user_password, user.user_password);

      if (!match) {
          return res.status(STATUS_CODE.INVALID).json({
              status: STATUS_CODE.INVALID,
              message:MESSAGE.INVALID_USER_MESSAGE
          });
      }

      const token = jwt.sign(
          { uid:user.id, email: user.email, user_password: user.user_password,admin:user.is_admin },
          process.env.SECRET_KEY,
          { expiresIn: '3h' }
      );

      res.json({ message:MESSAGE.LOGIN_SUCCESS_MESSAGE, token });
  } catch (error) {
      console.error(error.message)
      res.status(STATUS_CODE.SERVER_ERROR).json({
          status: STATUS_CODE.SERVER_ERROR,
          message:  error.message || MESSAGE.SERVER_ERROR_MESSAGE,

      });
  }
};

// **************************************************************

const updateUser = async (req, res) => {
  try {

      const{body:{email,user_password,first_name,last_name,mobile_number}}=req;
      const { uid: id } = req.user

      const formData ={email,user_password,first_name,last_name,mobile_number}

     const result= await updateUserData(formData,id);

      return res.status(STATUS_CODE.SUCCESS).send({
          status: STATUS_CODE.SUCCESS,
          message: MESSAGE.USER_UPDATE_SUCCESS_MSG
      });
  } catch (error) {
      console.error(error.message)
      return res.status(STATUS_CODE.SERVER_ERROR).send({
          status:STATUS_CODE.SERVER_ERROR,
          message: error.message ||  MESSAGE.SERVER_ERROR_MESSAGE,

      });
  }
};


// // *************************************************************************

const getUser = async (req, res) => {
  try {
      const tasks = await getUserData();
      return res.status(STATUS_CODE.SUCCESS).send({
          status: STATUS_CODE.SUCCESS,
          message: MESSAGE.SUCCESS_MESSAGE,
          data: tasks
      });
  } catch (error) {
      console.error(error.message)
      return res.status(STATUS_CODE.SERVER_ERROR).send({
          status: STATUS_CODE.SERVER_ERROR,
          message: error.message || MESSAGE.SERVER_ERROR_MESSAGE
      });
  }
};

// // *******************************************************************************

const deleteUser = async (req, res) => {
  try {
const { Id: id } = req.user

          const deleteUser = await deleteUserData(id);
     
      return res.status(STATUS_CODE.SUCCESS).send({
          status: STATUS_CODE.SUCCESS,
          message: MESSAGE.DELETE_SUCCESS_MESSAGE,
          user: deleteUser
      });

  } catch (error) {
      console.error(error.message)
      return res.status(STATUS_CODE.SERVER_ERROR).send({
          status: STATUS_CODE.SERVER_ERROR,
          message:  error.message || MESSAGE.SERVER_ERROR_MESSAGE,

      });
  }
};







export default { register, login, getUser,updateUser, deleteUser};
