const express = require('express');
const { createAnswer, getAnswers, createEvent, createQuestion, questionValid, deleteAnswer, deleteQuestion } = require('./queries');
const router = express.Router();

router.get('/questions/:id/answers', async function (req, res) {
    const questionId = req.params.id;

    const answers = await getAnswers(questionId);
    for (let index = 0; index < answers.length; index++) {
        const element = answers[index];

        answers[index] = {
            id: element.id,
            question_id: element.question_id,
            answerContent: element.content
        }
        
    }

    res.send(answers);
});

router.post('/questions/:id/answers', async function (req, res){
    const questionId = req.params.id;

    // If questionId provided is not valid
    // Do some checking
    const questionIsValid = await questionValid(questionId);
    if(!questionIsValid){
        console.log(`Asked for questionId = ${questionId}, but that id was not found`);
        return res.status(404).send("The requested id was not found!");
    }

    const { answerContent } = req.body;

    const {insertId} = await createAnswer(questionId, answerContent);

    res.status(201).send({insertId});
});

router.delete('/questions/:questionId/answers/:answerId', async function(req, res){
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;

    const deleteRes = await deleteAnswer(questionId, answerId);

    if(deleteRes.affectedRows > 0){
        return res.status(200).send("OK, answer deleted");
    }
    else{
        return res.status(404).send("That question - answer was not found!");
    }
});

router.post('/events', function (req, res) {
    console.log('Event Received:', req.body.type);
    createEvent(req.body);

    const { type, data } = req.body;

    if (type === 'QuestionCreated') {
        createQuestion(data.id);
    }
    else if (type === 'QuestionDeleted') {
        deleteQuestion(data.id);
    }
  
    res.send({});
});

module.exports = router;
