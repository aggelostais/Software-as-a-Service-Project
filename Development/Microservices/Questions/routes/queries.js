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
  dateStrings     : true,
  multipleStatements: true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createQuestion = async (question) => {
    try{
        let query = `INSERT INTO question(title, content, creator) VALUES("${question.title}", "${question.content}", "${question.creator}");`;

        let res= await pool.query(query);
        res = JSON.parse(JSON.stringify(res));
        //console.log(res);
        const {insertId}=res;

        query=`SELECT id,timestamp FROM question WHERE question.id="${insertId}";`
        res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        // Send a QuestionCreated object in the event-bus service
        axios.post('http://localhost:3005/events', {
            type: 'QuestionCreated',
            data: {
                id: res[0].id,
                timestamp: res[0].timestamp,
                creator:question.creator,
                title:question.title
            }
        });

        for(let i = 0; i < question.keywords.length; i++){
            let query = `INSERT INTO keyword(question_id, keyword) VALUES(${res[0].id}, "${question.keywords[i]}");`;

            let result=await pool.query(query);
            result=JSON.parse(JSON.stringify(result));

           // Send a KeywordCreated object in the event-bus service
            axios.post('http://localhost:3005/events', {
               type: 'KeywordCreated',
               data: {
                   id: result.insertId,
                   question_id: res[0].id,
                   keyword: question.keywords[i]
               }
            });
        }

        return res[0];

        
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
        question.creator
        FROM question 
        WHERE question.creator="${username}" 
        ORDER BY date DESC;`;
        
        let questions = await pool.query(query);

        // Convert OkPacket to plain object
        questions = JSON.parse(JSON.stringify(questions));

        return questions;
        
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
    getMyQuestions,
    deleteQuestion
}