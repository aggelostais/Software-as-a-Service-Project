const { default: axios } = require('axios');
const mysql = require('mysql');
const util = require('util');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 3306,
  user            : 'saas_user',
  password        : 'saas_user',
  database        : 'saas_stats',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createQuestion = async (id, timestamp,creator) => {
    try{
        let query = `INSERT INTO question(id, timestamp,creator) VALUES(${id}, "${timestamp}","${creator}");`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;
    }
    catch(err){
        throw err;
    }
}

const createKeyword = async (id, question_id,keyword) => {
    try{
        let query = `INSERT INTO keyword(id, question_id,keyword) VALUES(${id}, "${question_id}","${keyword}");`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;
    }
    catch(err){
        throw err;
    }
}

const createAnswer = async (id, question_id,creator,timestamp) => {
    try{
        let query = `INSERT INTO answer(id, question_id,creator,timestamp) VALUES(${id}, "${question_id}","${creator}", "${timestamp}");`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;
    }
    catch(err){
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

const getMyQuestions = async (username) => {
    try{
        let query = `Select question.id, DATE(question.timestamp) AS date, keyword.keyword 
        FROM question 
        JOIN keyword 
        ON question.id = keyword.question_id 
        WHERE question.creator="${username}" 
        ORDER BY date DESC;`;

        let questions = await pool.query(query);

        // Convert OkPacket to plain object
        questions = JSON.parse(JSON.stringify(questions));

        let renderedQuestions = {};
        for (let i = 0; i < questions.length; i++) {
            const {id, date, creator, keyword } = questions[i];

            if(!renderedQuestions[id]){
                // if id has not been rendered yet

                renderedQuestions[id] = {
                    id,
                    date,
                    keywords: [keyword],
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

const getMyAnswers = async (username) => {
    try{
        let query = `Select answer.id, answer.creator, DATE(answer.timestamp) AS date
        FROM answer 
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
        // Select the row with max id, find the last event in Questions database
        let query = `SELECT * FROM event WHERE id IN (SELECT MAX(id) FROM event);`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        let req_obj;
        if(res[0]){
            req_obj = res[0];
            req_obj = {
                id: req_obj.id, // Last event-id Questions database has
                timestamp: req_obj.timestamp,
                requester: 'http://localhost:3015'  // Stating identity of service
            }
            // console.log(req_obj);
        }
        else{
            req_obj = {
                id: 0,
                timestamp: '2021-01-01 00:00:00',
                requester: 'http://localhost:3015'
            }
        }

        axios.post('http://localhost:3005/fetchEvents', req_obj);

        return res;
        
    }catch(err){
        throw err;
    }
}


module.exports = {
    createQuestion,
    createAnswer,
    createKeyword,
    getQuestPerKey,
    getQuestPerDay,
    getMyQuestions,
    getMyAnswers,
    createEvent,
    updateEvents,
}