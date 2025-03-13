const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ERROR_STATUS_CODE,
    SUCCESS_STATUS_CODE,
    SUCCESS_MESSAGE,
    ERROR_MESSAGE, } = require("../constants/statusConstant")


const authenticateUser = (req, res, next) => {

    try {
        const token = req.header("Authorization")

        if (!token) {
            return res.status(ERROR_STATUS_CODE .INVALID).json({
                status: ERROR_STATUS_CODE .INVALID,
                message:  ERROR_MESSAGE.INVALID_TOKEN_MESSAGE
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            if (err) {
                return res.status(ERROR_STATUS_CODE.FORBIDDEN).json({
                    status: ERROR_STATUS_CODE.FORBIDDEN,
                    message:  ERROR_MESSAGE.FORBIDDEN_ERROR_MESSAGE
                });
            }
        }

        req.user = decoded;


        next();
    }
    catch (error) {
        res.status( ERROR_STATUS_CODE.INVALID).json({
            status:  ERROR_STATUS_CODE.INVALID,
            message:  ERROR_MESSAGE.INVALID_TOKEN_MESSAGE
        });
    }
};

module.exports = authenticateUser;
