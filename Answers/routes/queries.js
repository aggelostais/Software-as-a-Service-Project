const mysql = require('mysql');
const util = require('util');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 3306,
  user            : 'saas_user',
  password        : 'saas_user',
  database        : 'saas_answers'
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createAnswer = async (questionId, answerContent) => {
    try{
        let query = `INSERT INTO answer(question_id, content) VALUES(${questionId}, "${answerContent}");`;

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
        let query = `Select * FROM answer WHERE question_id = ${questionId} ORDER BY id ASC;`;

        let answers = await pool.query(query);
        // Convert OkPacket to plain object
        answers = JSON.parse(JSON.stringify(answers));        
        return answers;
        
    }catch(err){
        throw err;
    }
}

module.exports = {
    createAnswer,
    getAnswers
}