const express = require('express');
const { createAnswer, getAnswers, createEvent } = require('./queries');
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

    const { answerContent } = req.body;

    const {insertId} = await createAnswer(questionId, answerContent);

    res.status(201).send({insertId});
});

router.post('/events', function (req, res) {
    console.log('Event Received:', req.body.type);
    createEvent(req.body);

    const { type, data } = req.body;

    if (type === 'QuestionCreated') {
        
    }
  
    res.send({});
});

module.exports = router;
