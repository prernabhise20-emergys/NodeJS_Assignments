const bcrypt = require('bcrypt');
const db = require('../db/connection');

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

module.exports = { createUser, findUserByUsername };
