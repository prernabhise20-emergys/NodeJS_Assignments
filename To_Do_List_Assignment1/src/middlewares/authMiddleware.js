const jwt = require("jsonwebtoken");
require("dotenv").config();
const { message, status } = require("../constants/statusConstant")


const authenticateUser = (req, res, next) => {

    try {
        const token = req.header("Authorization")

        if (!token) {
            return res.status(status.INVALID).json({
                status: status.INVALID,
                message: message.INVALID_TOKEN_MESSAGE
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            if (err) {
                return res.status(status.FORBIDDEN).json({
                    status: status.FORBIDDEN,
                    message: message.FORBIDDEN_ERROR_MESSAGE
                });
            }
        }

        req.user = decoded;


        next();
    }
    catch (error) {
        res.status(status.INVALID).json({
            status: status.INVALID,
            message: message.INVALID_TOKEN_MESSAGE
        });
    }
};

module.exports = authenticateUser;
