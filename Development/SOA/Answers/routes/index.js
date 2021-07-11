const express = require('express');
const axios = require('axios');
const router = express.Router();


const AuthorizedToken = async (token) => {
    reqBody = {
        actionType: 'TokenAuthorization',
        parameters: [token]
    }

    // Check if TokenAuthorization action is provided by another service
    const {data:services} = await axios.get('http://localhost:4000/serviceDiscovery');
    console.log(services);
    let auth_offered = false;

    // Loop through actions provided
    for (const key of Object.keys(services)) {
        if (key === 'Authorization' && Object.keys(services[key])[0]==='TokenAuthorization')
            auth_offered = true;
    }

    if (auth_offered) {
        const authorizationRes = await axios.post('http://localhost:4000/serviceExecution', reqBody);
        console.log(authorizationRes);
        return authorizationRes.data.user;
    } else
        return null; // If Authorization service is unavailable
}

const ValidateQuestion = async (questionId) => {
    const reqBody = {
        actionType: 'ValidateQuestion',
        parameters: [questionId]
    }

    // Check if TokenAuthorization action is provided by another service
    const {data:services} = await axios.get('http://localhost:4000/serviceDiscovery');
    console.log(services);
    let quest_offered = false;

    // Loop through actions provided
    for (const key of Object.keys(services)) {
        if (key === 'Questions' && Object.keys(services[key])[0]==='ValidateQuestion')
            quest_offered = true;
    }

    if (quest_offered) {
        const validationRes = await axios.post('http://localhost:4000/serviceExecution', reqBody);
        return validationRes.data.result;
    } else
        return null; // If Question service is unavailable
}

// GET question's answers
router.get('/questions/:id/answers', async function (req, res) {
    const questionId = req.params.id;

    const {data:answers}= await axios.post(`http://localhost:3020/getAnswers`, {question_id:questionId});
    console.log(answers);
    for (let index = 0; index < answers.length; index++) {
        const element = answers[index];

        answers[index] = {
            id: element.id,
            question_id: element.question_id,
            answerContent: element.content,
            creator: element.creator
        }
        
    }

    res.send(answers);
});

// Create answer
router.post('/questions/:id/answers', 
    async function (req, res){
        const questionId = req.params.id;
        const token = req.header('Authorization');

        // Authorize token
        const user = await AuthorizedToken(token);
        if(!user){
            return res.status(401).send('Unauthorized');
        }

        // If questionId provided is not valid
        // Do some checking
        // const {data:questionIsValid}= await axios.post(`http://localhost:3020/questionValid`, {question_id:questionId});
        const questionIsValid = await ValidateQuestion(questionId);

        if(!questionIsValid){
            console.log(`Asked for questionId = ${questionId}, but that id was not found`);
            return res.status(404).send("The requested id was not found!");
        }

        const {answerContent} = req.body;

        console.log("User:"+user+", answer: "+answerContent);

        const {insertId} = await axios.post(`http://localhost:3020/createAnswer`,
            {question_id:questionId,answer_content:answerContent,creator:user});

        res.status(201).send({insertId});
});

// Delete answer
router.delete('/questions/:questionId/answers/:answerId', 
    async function(req, res){
        const questionId = req.params.questionId;
        const answerId = req.params.answerId;
        const token = req.header('Authorization');

        // Authorize token
        const user = await AuthorizedToken(token);
        if(!user){
            return res.status(401).send('Unauthorized');
        }

        const {data:deleteRes}= await axios.post(`http://localhost:3020/deleteAnswer`, {question_id:questionId,answer_id:answerId});

        if(deleteRes.affectedRows > 0){
            return res.status(200).send("OK, answer deleted");
        }
        else{
            return res.status(404).send("That question - answer was not found!");
        }
});

/* GET my Answers */
router.get('/myAnswers',
  async function(req, res) {
    const token = req.header('Authorization');
    // Authorize token
    const user = await AuthorizedToken(token);
    if(!user){
        return res.status(401).send('Unauthorized');
    }

    const {data:myAnswers}= await axios.post(`http://localhost:3020/getMyAnswers`, {user});
    res.send(myAnswers);
});

module.exports = router;
