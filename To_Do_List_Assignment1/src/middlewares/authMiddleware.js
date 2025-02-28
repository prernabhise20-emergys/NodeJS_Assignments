const jwt = require("jsonwebtoken");
require("dotenv").config();
const constantDetails = require('../constants/statusConstant')


const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")

    try {
        if (!token) {
            return res.status(constantDetails.NO_TOKEN.STATUS_CODE).json({
                status: constantDetails.NO_TOKEN.STATUS_CODE,
                message: constantDetails.NO_TOKEN.MESSAGE
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if(!decoded){
            if (err) {
                return res.status(constantDetails.FORBIDDEN_ERROR.STATUS_CODE).json({
                    status: constantDetails.FORBIDDEN_ERROR.STATUS_CODE,
                    message: constantDetails.FORBIDDEN_ERROR.MESSAGE
                });
            }
        }

        req.user = decoded;


        next();
    }
    catch (error) {
        res.status(constantDetails.NOT_FOUND.STATUS_CODE).json({
            message: constantDetails.NOT_FOUND.MESSAGE
        });
    }
};

module.exports = authenticateUser;
