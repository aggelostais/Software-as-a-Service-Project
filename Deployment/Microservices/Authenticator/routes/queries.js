const { default: axios } = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret-key';
const mysql = require('mysql');
const util = require('util');

// Database connection
// mysql://b7518104de0b1d:def139b7@eu-cdbr-west-01.cleardb.com/heroku_4b64c5e006ea57d?reconnect=true
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'eu-cdbr-west-01.cleardb.com',
    port            : 3306,
    user            : 'b7518104de0b1d',
    password        : 'def139b7',
    database        : 'heroku_4b64c5e006ea57d',
    dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const signIn = async (user)=>{
    try{
        console.log(user);
        let query=`SELECT * FROM user WHERE username='${user.username}'`;
        let res = await pool.query(query);  // Wait for results of the query

        // User exists
        if(res.length > 0){
            // Convert OkPacket to plain object
            [res] = JSON.parse(JSON.stringify(res));

            console.log(res);
            // Compare passwords
            if(await bcrypt.compare(user.password, res.password)) {
                // Create token
                const username_obj = { username: user.username};
                const accessToken = jwt.sign(username_obj, JWT_SECRET, {expiresIn: 600});
                return {token: accessToken};

            } else {
                return {token:'Invalid password.'};
            }
        }
        else{
            return {token:'User not found.'};
        }
    }
    catch(err){
        console.log('SignIn Error: ' + err);
        throw err;
    }
}

const signUp = async (user) => {
    try{

        // Check if username appears in the database
        let query = `SELECT * FROM user WHERE username='${user.username}'`;
        let res = await pool.query(query);  // Wait for results of the query

        // Username already exists
        if(res.length > 0) {
            return false;
        }

        query = `INSERT INTO user(username,password) VALUES("${user.username}", "${user.password}");`;
        res = await pool.query(query);  // Wait for results of the query

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));
        return res;
    }
    catch(err){
        return err;
    }
}

const deleteUser = async (userId) => {
    try{
        let query = `DELETE FROM user WHERE id = ${userId};`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res
    }
    catch(err){
        throw err;
    }
}

module.exports = {
    signIn,
    signUp,
    deleteUser
}