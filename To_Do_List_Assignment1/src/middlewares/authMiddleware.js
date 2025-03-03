const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MESSAGE, STATUS_CODE } = require("../constants/statusConstant")


const authenticateUser = (req, res, next) => {

    try {
        const token = req.header("Authorization")

        if (!token) {
            return res.status(STATUS_CODE .INVALID).json({
                status: STATUS_CODE .INVALID,
                message:  MESSAGE.INVALID_TOKEN_MESSAGE
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            if (err) {
                return res.status(STATUS_CODE.FORBIDDEN).json({
                    status: STATUS_CODE.FORBIDDEN,
                    message:  MESSAGE.FORBIDDEN_ERROR_MESSAGE
                });
            }
        }

        req.user = decoded;


        next();
    }
    catch (error) {
        res.status( STATUS_CODE.INVALID).json({
            status:  STATUS_CODE.INVALID,
            message:  MESSAGE.INVALID_TOKEN_MESSAGE
        });
    }
};

module.exports = authenticateUser;
