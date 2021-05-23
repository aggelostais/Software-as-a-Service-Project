const { default: axios } = require('axios');
const mysql = require('mysql');
const util = require('util');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 3306,
  user            : 'saas_user',
  password        : 'saas_user',
  database        : 'saas_questions',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createQuestion = async (question) => {
    try{
        let query = `INSERT INTO question(title, content) VALUES("${question.title}", "${question.content}");`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        for(let i = 0; i < question.keywords.length; i++){
            let query = `INSERT INTO keyword(question_id, keyword) VALUES(${res.insertId}, "${question.keywords[i]}");`;

            await pool.query(query);
        }

        return res;
        
    }catch(err){
        throw err;
    }
}

const getQuestions = async () => {
    try{
        let query = `Select question.id, question.title, question.content, keyword.keyword FROM question JOIN keyword ON question.id = keyword.question_id ORDER BY question.id ASC;`;

        let questions = await pool.query(query);

        // Convert OkPacket to plain object
        questions = JSON.parse(JSON.stringify(questions));

        let renderedQuestions = {};
        for (let i = 0; i < questions.length; i++) {
            const {id, title, content, keyword } = questions[i];

            if(!renderedQuestions[id]){
                // if that id has not been rendered yet

                renderedQuestions[id] = {
                    id,
                    title,
                    keywords: [keyword],
                    content,
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
                requester: 'http://localhost:3011'
            }
            // console.log(req_obj);
        }
        else{
            req_obj = {
                id: 0,
                timestamp: '2021-01-01 00:00:00',
                requester: 'http://localhost:3011'
            }
        }

        axios.post('http://localhost:3005/fetchEvents', req_obj);

        return res;
        
    }catch(err){
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
    createQuestion,
    getQuestions,
    createEvent,
    updateEvents,
    deleteQuestion
}