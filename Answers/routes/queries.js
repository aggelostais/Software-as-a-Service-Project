const { default: axios } = require('axios');
const mysql = require('mysql');
const util = require('util');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 3306,
  user            : 'saas_user',
  password        : 'saas_user',
  database        : 'saas_answers',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createAnswer = async (questionId, answerContent, creator) => {
    try{
        let query = `INSERT INTO answer(question_id, content, creator) VALUES(${questionId}, "${answerContent}", "${creator}");`;

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

const createEvent = async (event) => {
    try{
        const data = (JSON.stringify(event.data)).replace(/"/g, "\'");
        let query = `INSERT INTO event(id, timestamp, type, data) VALUES(${event.id}, "${event.timestamp}", "${event.type}", "${data}");`;
        // console.log(query);

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;
        
    }catch(err){
        throw err;
    }
}

const updateEvents = async () => {
    try{
        // fetch the latest event received
        // Select the row with max id
        let query = `SELECT * FROM event WHERE id IN (SELECT MAX(id) FROM event);`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        let req_obj;
        if(res[0]){
            req_obj = res[0];
            req_obj = {
                id: req_obj.id,
                timestamp: req_obj.timestamp,
                requester: 'http://localhost:3012'
            }
            // console.log(req_obj);
        }
        else{
            req_obj = {
                id: 0,
                timestamp: '2021-01-01 00:00:00',
                requester: 'http://localhost:3012'
            }
        }

        axios.post('http://localhost:3005/fetchEvents', req_obj);

        return res;
        
    }catch(err){
        throw err;
    }
}

const createQuestion = async (id) => {
    try{
        let query = `INSERT INTO question(id) VALUES(${id});`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;
    }
    catch(err){
        throw err;
    }
}

const questionValid = async (id) => {
    try{
        let query = `SELECT * FROM question WHERE id = ${id};`;

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


module.exports = {
    createAnswer,
    getAnswers,
    createEvent,
    updateEvents,
    createQuestion,
    questionValid,
    deleteAnswer,
    deleteQuestion
}