const express = require('express');
const { randomBytes } = require('crypto');
const router = express.Router();

const answersByQuestionId = {};

router.get('/questions/:id/answers', function (req, res) {
    res.send(answersByQuestionId[req.params.id] || []);
});

router.post('/questions/:id/answers', function (req, res){
    const answerId = randomBytes(4).toString('hex');
    const questionId = req.params.id;
    const { answerContent } = req.body;

    const answers = answersByQuestionId[questionId] || [];

    answers.push({ id: answerId, answerContent });

    answersByQuestionId[questionId] = answers;

    res.status(201).send(answers);
    console.log(answersByQuestionId);
});

module.exports = router;
