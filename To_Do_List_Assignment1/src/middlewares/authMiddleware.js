const jwt = require("jsonwebtoken");
require("dotenv").config();
const constantDetails = require('../constants/constant')


const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({
            message: constantDetails.NO_TOKEN.MESSAGE
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({
            message: constantDetails.INVALID.MESSAGE
        });
    }
};

module.exports = authenticateUser;
