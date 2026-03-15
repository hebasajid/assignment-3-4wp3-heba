const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

const UsersModel = {
    // finding a user by their username for login: 
    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE username = ?", [username], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },

    // creating a new user - for  sign up task
    createUser: (username, password, level = 'member') => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO Users (username, password, level) VALUES (?, ?, ?)", 
            [username, password, level], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    
};

module.exports = UsersModel;