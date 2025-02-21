const bcrypt = require('bcrypt');
const db = require('../db/connection');


const getAllUser = async () => {

    try {
        const data = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM USERINFO WHERE is_deleted =FALSE", (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });

        return data;
    } catch (error) {
        console.error("Error in fetching tasks", error);
        throw new Error(error.message);
    }
}

// ****************************************************

const createUser = async (username, password, name, contact_no) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword, name, contact_no };

        return new Promise((resolve, reject) => {
            db.query('INSERT INTO USERINFO SET ?', user, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

// ******************************************************

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM USERINFO WHERE USERNAME = ?', [username], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
};

// **********************************************************

const updateUser = async ({ username, password, name, contact_no, userId }) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE USERINFO SET USERNAME = ?, PASSWORD= ?, NAME = ?, CONTACT_NO=? WHERE USERID = ?",
                [username, password, name, contact_no, userId],
                (error, result) => {
                    if (error) {
                        console.error("Database query error", error);
                        return reject(new Error("Database operation failed"));
                    }
                    resolve(result);
                }
            );
        });

        return data;
    } catch (error) {
        console.error("Error in updateUser function", error);
        throw new Error(error.message);
    }
};

// ******************************************************************

const deleteUser = async (userId) => {
    try {

        if (!userId) {
            throw new Error("Task ID is required");
        }

        await new Promise((resolve, reject) => {
            db.query("SELECT * FROM USERINFO WHERE USERID = ?", [userId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length === 0) {
                    return reject(new Error("User not found"));
                }
                return resolve(true);
            });
        });

        const data = await new Promise((resolve, reject) => {
            db.query("UPDATE USERINFO SET is_deleted = TRUE WHERE USERID = ?",
                [userId],
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (result.affectedRows === 0) {
                        return reject(new Error("user not found or already deleted"));
                    }
                    return resolve(result);
                });
        });

        return data;
    } catch (error) {
        console.error("Error in soft delete user:", error.message);
        throw new Error(error.message);
    }
};

// ********************************************************************

const checkIfUserExists = async (userInfo) => {
    try {
        const { username } = userInfo;

        const result = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM USERINFO WHERE USERNAME = ?",
                [username], (error, results) => {
                    if (error) {
                        console.error("Database query error:", error);
                        return reject(new Error("Failed to check user in data"));
                    }
                    resolve(results);
                });
        });

        return result.length > 0;

    } catch (error) {
        console.error("Error in checkIfUserExists:", error);
        throw new Error(error.message);
    }
};

module.exports = {
    createUser,
    findUserByUsername,
    updateUser,
    getAllUser,
    deleteUser,
    checkIfUserExists
};



