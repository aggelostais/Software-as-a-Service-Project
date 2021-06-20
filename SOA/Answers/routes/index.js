const express = require('express');
const axios = require('axios');
const { createAnswer, getAnswers, getMyAnswers, createEvent, createQuestion, questionValid, deleteAnswer, deleteQuestion } = require('./queries');
const router = express.Router();

const AuthorizedToken = async (token) => {
    reqBody = {
        origin: 'http://localhost:3012',
        destination: 'http://localhost:3010',
        actionType: 'Authorization',
        parameters: [token]
    }
    const authorizationRes = await axios.post('http://localhost:4000/serivceExecution', reqBody);
    if(authorizationRes.data.resultStatus == 200){
        return true;
    }
    else{
        return false;
    }
}

router.get('/questions/:id/answers', async function (req, res) {
    const questionId = req.params.id;

    const answers = await getAnswers(questionId);
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

router.post('/questions/:id/answers', 
    // passport.authenticate('token', { session: false }),
    async function (req, res){
        const questionId = req.params.id;
        const token = req.header('Authorization');

        // Authorize token
        if(! await AuthorizedToken(token)){
            return res.status(401).send('Unauthorized');
        }
        else{
            res.send('Authorized');
        }

        // // If questionId provided is not valid
        // // Do some checking
        // const questionIsValid = await questionValid(questionId);
        // if(!questionIsValid){
        //     console.log(`Asked for questionId = ${questionId}, but that id was not found`);
        //     return res.status(404).send("The requested id was not found!");
        // }

        // const { answerContent } = req.body;

        // const {insertId} = await createAnswer(questionId, answerContent, req.user.username);

        // res.status(201).send({insertId});
});

router.delete('/questions/:questionId/answers/:answerId', 
    // passport.authenticate('token', { session: false }),
    async function(req, res){
        const questionId = req.params.questionId;
        const answerId = req.params.answerId;
        const token = req.header('Authorization');

        // Authorize token
        if(! await AuthorizedToken(token)){
            return res.status(401).send('Unauthorized');
        }
        else{
            res.send('Authorized');
        }

        // const deleteRes = await deleteAnswer(questionId, answerId);

        // if(deleteRes.affectedRows > 0){
        //     return res.status(200).send("OK, answer deleted");
        // }
        // else{
        //     return res.status(404).send("That question - answer was not found!");
        // }
});

/* GET my Ansers */
router.get('/myAnswers', 
//   passport.authenticate('token', { session: false }),
  async function(req, res) {
    const token = req.header('Authorization');

    // Authorize token
    if(! await AuthorizedToken(token)){
        return res.status(401).send('Unauthorized');
    }
    else{
        res.send('Authorized');
    }
    // const myAnswers = await getMyAnswers(req.user.username);
    // res.send(myAnswers);
});

router.post('/events', function (req, res) {
    console.log('Event Received:', req.body.type);
    createEvent(req.body);

    const { type, data } = req.body;

    if (type === 'QuestionCreated') {
        createQuestion(data.id, data.title);
    }
    else if (type === 'QuestionDeleted') {
        deleteQuestion(data.id);
    }
  
    res.send({});
});

module.exports = router;
