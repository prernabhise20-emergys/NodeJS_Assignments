module.exports = {
    CREATED: {
        STATUS_CODE: 201,
        MESSAGE: "Created Successfully"
    },
    SUCCESS: {
       STATUS_CODE: 200,
        MESSAGE: "Action Perform Successfully"
    },
    ERROR: {
       STATUS_CODE: 500,
        MESSAGE: "Internal Server Error"
    },
    BAD_REQUEST: {
       STATUS_CODE: 400,
        MESSAGE: "Fields are required"
    },
    NOT_FOUND:{
       STATUS_CODE:404,
        MESSAGE:"Data not found"
    },
    NO_TOKEN:{
MESSAGE: "Access denied. No token provided."
    },
    INVALID:{
MESSAGE: "Invalid token."
    }
}