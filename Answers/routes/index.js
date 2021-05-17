const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const router = express.Router();

const answersByQuestionId = {};

router.get('/questions/:id/answers', function (req, res) {
    const questionId = req.params.id;

    res.send(answersByQuestionId[questionId]);
});

router.post('/questions/:id/answers', function (req, res){
    const answerId = randomBytes(4).toString('hex');
    const questionId = req.params.id;

    // If questionId provided is not valid
    if (!answersByQuestionId[questionId]) {
        console.log('Attempt to post an answer for question ' + questionId + ' but that id was not found');
        return res.status(404).send('Invalid questionId');
    }

    const { answerContent } = req.body;

    const answers = answersByQuestionId[questionId];

    answers.push({ id: answerId, answerContent });

    answersByQuestionId[questionId] = answers;

    res.status(201).send(answers);
    console.log(answersByQuestionId);
});

router.post('/events', function (req, res) {
    console.log('Event Received:', req.body.type);

    const { type, data } = req.body;

    if (type === 'QuestionCreated') {
        const questionId = data.id;
        
        answersByQuestionId[questionId] = [];
    }
  
    res.send({});
});

module.exports = router;
