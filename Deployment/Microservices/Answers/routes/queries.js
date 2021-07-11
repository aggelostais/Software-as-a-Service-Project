const { default: axios } = require('axios');
const mysql = require('mysql');
const util = require('util');

// mysql://bd7bd9dd236a1d:e305f56e@eu-cdbr-west-01.cleardb.com/heroku_64e63a78b068212?reconnect=true
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'eu-cdbr-west-01.cleardb.com',
  port            : 3306,
  user            : 'bd7bd9dd236a1d',
  password        : 'e305f56e',
  database        : 'heroku_64e63a78b068212',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createAnswer = async (questionId, answerContent, creator) => {
    try{
        let query = `INSERT INTO answer(question_id, content, creator) VALUES(${questionId}, "${answerContent}", "${creator}");`;

        let res = await pool.query(query);

        res = JSON.parse(JSON.stringify(res));
        //console.log(res);
        const {insertId}=res;

        query=`SELECT id,timestamp FROM answer WHERE answer.id="${insertId}";`
        res = await pool.query(query);

        // Send a QuestionCreated object in the event-bus service
        axios.post('https://microservices-event-bus.herokuapp.com/events', {
            type: 'AnswerCreated',
            data: {
                id: insertId,
                question_id: questionId,
                creator:creator,
                timestamp:res[0].timestamp
            }
        });

        return res[0].id;
        
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
                requester: 'https://microservices-answers.herokuapp.com'
            }
            // console.log(req_obj);
        }
        else{
            req_obj = {
                id: 0,
                timestamp: '2021-01-01 00:00:00',
                requester: 'https://microservices-answers.herokuapp.com'
            }
        }

        axios.post('https://microservices-event-bus.herokuapp.com/fetchEvents', req_obj);

        return res;
        
    }catch(err){
        throw err;
    }
}

const createQuestion = async (id, title) => {
    try{
        let query = `INSERT INTO question(id, title) VALUES(${id}, "${title}");`;

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

const getMyAnswers = async (username) => {
    try{
        let query = `Select answer.id, answer.content, answer.creator, DATE(answer.timestamp) AS date, question.title AS question_title
        FROM answer 
        JOIN question
        ON question.id = answer.question_id  
        WHERE answer.creator="${username}" 
        ORDER BY date DESC;`;

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
    getAnswers,
    getMyAnswers,
    createEvent,
    updateEvents,
    createQuestion,
    questionValid,
    deleteAnswer,
    deleteQuestion
}