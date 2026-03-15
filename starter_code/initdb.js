const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function init() {
    console.log("Hashing passwords");
    
    //creating hashes for the passwords of default users:
    const memberHash = await bcrypt.hash('member1', saltRounds);
    const member2Hash = await bcrypt.hash('member2', saltRounds);
    const editorHash = await bcrypt.hash('editor1', saltRounds);
    const editor2Hash = await bcrypt.hash('editor2', saltRounds);

    db.serialize(function() {
        console.log("Setting up database tables...");

        //creating users
        db.run("DROP TABLE IF EXISTS Users");
        db.run("CREATE TABLE Users (username TEXT, password TEXT, level TEXT)");
        
        const userStmt = db.prepare("INSERT INTO Users VALUES (?,?,?)");
        userStmt.run('member1', memberHash, 'member');
        userStmt.run('member2', member2Hash, 'member');
        userStmt.run('editor1', editorHash, 'editor');
        userStmt.run('editor2', editor2Hash, 'editor');
        userStmt.finalize();

        //creating default articles:
        db.run("DROP TABLE IF EXISTS Articles");
        db.run("CREATE TABLE Articles (title TEXT, username TEXT, content TEXT)");
        
        const articleStmt = db.prepare("INSERT INTO Articles VALUES (?,?,?)");
        articleStmt.run("My favourite places to eat", "member1", "<p>My favourite places to eat are The Keg...</p>");
        articleStmt.run("Tips for NodeJS", "member2", "<p>The trick to understanding NodeJS...</p>");
        articleStmt.run("Ontario's top hotels", "editor1", "<p>The best hotel in Ontario is...</p>");
        articleStmt.finalize();

        console.log("Database successfully initialized!");
    });
}

init();