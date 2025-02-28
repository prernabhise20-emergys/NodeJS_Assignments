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
    NOT_FOUND: {
        STATUS_CODE: 404,
        MESSAGE: "Data not found"
    },
    NO_TOKEN: {
        STATUS_CODE:401,
        MESSAGE: "Access denied. No token provided."
    },
    INVALID_TOKEN: {
        STATUS_CODE:401,
        MESSAGE: "Invalid token."
    },
    INVALID_USER: {
        STATUS_CODE: 401,
        MESSAGE: "Invalid User"
    },
    DUPLICATE: {
        STATUS_CODE:409,
        MESSAGE: "Similar details already exists"
    },
    INVALID_COLUMN: {
        STATUS_CODE: 401,
        MESSAGE: "Invalid column name. Use 'title' or 'description"
    },
    MISSING: {
        STATUS_CODE: 400,
        MESSAGE: "Keyword is required for searching"
    },
    REGISTER: {
        STATUS_CODE: 200,
        MESSAGE: 'User registered successfully'
    },
    LOGIN: {
        STATUS_CODE: 200,
        MESSAGE: 'Login successful'
    },
    FAILED_CHECK:{
        STATUS_CODE: 400,
        MESSAGE:"Failed to check task in data"
    },
    FAILED_CREATE:{
        STATUS_CODE: 400,
        MESSAGE:"Failed to create task"
    },
    DB_ERROR:{
        STATUS_CODE: 400,
        MESSAGE:"Database operation failed"
    },
    TASK_NOTFOUND:{
        STATUS_CODE: 404,
        MESSAGE:"Task not found"
    },
    FAILURE:{
        STATUS_CODE: 401,
        MESSAGE:"Failed to retrieve sorted tasks"
    },
    UNEXPECTED_ERROR:{
        STATUS_CODE:401,
        MESSAGE:"Unexpected error"
    },
    FORBIDDEN_ERROR:{
        STATUS_CODE:403,
        MESSAGE:"Failed to authenticate token"
    }

}