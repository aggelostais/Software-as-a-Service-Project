const { default: axios } = require('axios');
const mysql = require('mysql');
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret-key';

// mysql://b205ab46688012:13356686@eu-cdbr-west-01.cleardb.com/heroku_f877b418f446e80?reconnect=true
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'eu-cdbr-west-01.cleardb.com',
  port            : 3306,
  user            : 'b205ab46688012',
  password        : '13356686',
  database        : 'heroku_f877b418f446e80',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

// Authentication Queries
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