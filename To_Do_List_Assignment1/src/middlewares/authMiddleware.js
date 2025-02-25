const jwt = require("jsonwebtoken");
require("dotenv").config();
const constantDetails = require('../constants/statusConstant')


const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")
    // ?
    // .split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({
                message: constantDetails.NO_TOKEN.MESSAGE
            });
        }
    // console.log("1",req.user);
    
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(decoded);
        
        req.user = decoded;

        // console.log("2",req.user);

        next();
    }
    catch (error) {
        res.status(400).json({
            message: constantDetails.INVALID.MESSAGE
        });
    }
};

module.exports = authenticateUser;
