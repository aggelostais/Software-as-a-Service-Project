const { default: axios } = require('axios');
const mysql = require('mysql');
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret-key';
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 3306,
  user            : 'saas_user',
  password        : 'saas_user',
  database        : 'saas_soa',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.


 // Question Queries
const createQuestion = async (question) => {
    try{
        let query = `INSERT INTO question(title, content, creator) VALUES(
            "${question.new_question.title}", 
            "${question.new_question.content}", 
            "${question.new_question.creator}");`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        for(let i = 0; i < question.new_question.keywords.length; i++){
            let query = `INSERT INTO keyword(question_id, keyword) VALUES(${res.insertId}, "${question.new_question.keywords[i]}");`;

            await pool.query(query);
        }

        return res;
        
    }catch(err){
        throw err;
    }
}

const getQuestions = async () => {
    try{
        let query = `Select question.id, question.title, question.timestamp, question.content, question.creator, keyword.keyword FROM question JOIN keyword ON question.id = keyword.question_id ORDER BY question.id ASC;`;

        let questions = await pool.query(query);

        // Convert OkPacket to plain object
        questions = JSON.parse(JSON.stringify(questions));

        let renderedQuestions = {};
        for (let i = 0; i < questions.length; i++) {
            const {id, title,timestamp, content, creator, keyword } = questions[i];

            if(!renderedQuestions[id]){
                // if id has not been rendered yet

                renderedQuestions[id] = {
                    id,
                    title,
                    timestamp,
                    keywords: [keyword],
                    content,
                    creator,
                };
            }
            else{
                renderedQuestions[id].keywords.push(keyword)
            }
        }
        
        return renderedQuestions;
        
    }catch(err){
        throw err;
    }
}

const getMyQuestions = async (username) => {
    try{
        let query = `Select question.id, question.title, DATE(question.timestamp) AS date, question.content, 
        question.creator, keyword.keyword 
        FROM question 
        JOIN keyword 
        ON question.id = keyword.question_id 
        WHERE question.creator="${username.user}" 
        ORDER BY question.timestamp DESC;`;

        let questions = await pool.query(query);

        // Convert OkPacket to plain object
        questions = JSON.parse(JSON.stringify(questions));

        let renderedQuestions = {};
        for (let i = 0; i < questions.length; i++) {
            const {id, title, date, content, creator, keyword } = questions[i];

            if(!renderedQuestions[id]){
                // if id has not been rendered yet

                renderedQuestions[id] = {
                    id,
                    title,
                    date,
                    keywords: [keyword],
                    content,
                    creator,
                };
            }
            else{
                renderedQuestions[id].keywords.push(keyword)
            }
        }
        
        return renderedQuestions;
        
    }catch(err){
        throw err;
    }
}

const getQuestPerKey = async () => {
    try {
        let query = `SELECT keyword, COUNT(*) AS related_questions FROM keyword GROUP BY keyword ORDER BY related_questions DESC;`;
        let questions = await pool.query(query);

        questions = JSON.parse(JSON.stringify(questions));
        //console.log(questions);
        return questions;

    } catch (err) {
        throw err;
    }
}

const getQuestPerDay = async () => {
    try {
        let query = `SELECT DATE(timestamp) AS date, COUNT(*) AS related_questions FROM question GROUP BY date ORDER BY date DESC;`;
        let questions = await pool.query(query);

        questions = JSON.parse(JSON.stringify(questions));
        //console.log(questions);
        return questions;

    } catch (err) {
        throw err;
    }
}

const deleteQuestion = async (questionId) => {
    try{
        let query = `DELETE FROM question WHERE id = ${questionId};`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res
    }
    catch(err){
        throw err;
    }
}

// Answer Queries
const createAnswer = async (answer) => {
    try{
        console.log(answer);
        let query = `INSERT INTO answer(question_id, content, creator) VALUES(${answer.question_id}, "${answer.answer_content}", "${answer.creator}");`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;

    }catch(err){
        throw err;
    }
}

const getAnswers = async (questionId) => {
    try{
        let query = `Select * FROM answer WHERE question_id = ${questionId.question_id} ORDER BY id ASC;`;

        let answers = await pool.query(query);
        // Convert OkPacket to plain object
        answers = JSON.parse(JSON.stringify(answers));
        return answers;

    }catch(err){
        throw err;
    }
}

const questionValid = async (id) => {
    try{
        let query = `SELECT * FROM question WHERE id = ${id.question_id};`;

        let res = await pool.query(query);

        if(res[0]) return true;
        else return false;
    }
    catch(err){
        throw err;
    }
}

const deleteAnswer = async (questionId, answerId) => {
    try{
        let query = `DELETE FROM answer WHERE id = ${answerId} AND question_id = ${questionId};`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res
    }
    catch(err){
        throw err;
    }
}

const getMyAnswers = async (username) => {
    try{
        let query = `Select answer.id, answer.content, answer.creator, DATE(answer.timestamp) AS date, question.title AS question_title
        FROM answer 
        JOIN question
        ON question.id = answer.question_id  
        WHERE answer.creator="${username.user}" 
        ORDER BY answer.timestamp DESC;`;

        let answers = await pool.query(query);

        // Convert OkPacket to plain object
        answers = JSON.parse(JSON.stringify(answers));

        return answers;

    }catch(err){
        throw err;
    }
}

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
    createQuestion,
    getQuestions,
    getMyQuestions,
    getQuestPerKey,
    getQuestPerDay,
    deleteQuestion,
    createAnswer,
    getAnswers,
    getMyAnswers,
    questionValid,
    deleteAnswer,
    signIn,
    signUp,
    deleteUser
}