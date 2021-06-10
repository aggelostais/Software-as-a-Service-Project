const { default: axios } = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret-key';
const mysql = require('mysql');
const util = require('util');

// Database connection
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    port            : 3306,
    user            : 'saas_user',
    password        : 'saas_user',
    database        : 'saas_users',
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