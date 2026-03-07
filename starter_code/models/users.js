const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

const UsersModel = {
    // finding a user by their username (for the Login task)
    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE username = ?", [username], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },

    
};

module.exports = UsersModel;