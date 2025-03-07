const bcrypt = require('bcrypt');
const db = require('../db/connection');

const getUser = async (userId) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM USERINFO WHERE is_deleted =FALSE AND USERID=?", userId, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
        return data;
    } catch (error) {
        throw error;
    }
}

// ****************************************************

const createUser = async (username, password, name, contact_no, email) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword, name, contact_no, email };

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
        throw error;
    }
};

// ******************************************************

const login = (username) => {
    try {
        return new Promise((resolve, reject) => {
            db.query("SELECT *FROM USERINFO WHERE USERNAME = ?", username, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }
    catch (error) {
        throw error;
    }
};

// **********************************************************

const updateUser = async (formData, uid) => {
    try {

        const { username, password, name, contact_no } = formData;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashPassword, name, contact_no };

        const data = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE USERINFO SET ? WHERE USERID = ?",
                [user, uid],
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
        throw error;
    }
};


// ******************************************************************

const deleteUser = async (userId) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query("UPDATE USERINFO SET is_deleted = TRUE WHERE USERID = ?",
                userId,
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                });
        });

        return data;
    } catch (error) {
        throw error;
    }
};

// ********************************************************************

const checkIfUserExists = async (username,) => {
    try {

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
        throw error;
    }
};

module.exports = {
    createUser,
    login,
    updateUser,
    getUser,
    deleteUser,
    checkIfUserExists
};



