const express = require('express');
const { createAnswer, getAnswers, getMyAnswers, createEvent, createQuestion, questionValid, deleteAnswer, deleteQuestion } = require('./queries');
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'secret-key';
const router = express.Router();

passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done){
        return done(null, { username: token.username});
    }
));

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
    passport.authenticate('token', { session: false }),
    async function (req, res){
        const questionId = req.params.id;

        // Check if question provided is valid
        const questionIsValid = await questionValid(questionId);
        if(!questionIsValid){
            console.log(`Asked for questionId = ${questionId}, but that id was not found`);
            return res.status(404).send("The requested id was not found!");
        }

        const { answerContent } = req.body;

        const {insertId} = await createAnswer(questionId, answerContent, req.user.username);

        res.status(201).send({insertId});
});

router.delete('/questions/:questionId/answers/:answerId', 
    passport.authenticate('token', { session: false }),
    async function(req, res){
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

/* GET my Answers */
router.get('/myAnswers', 
  passport.authenticate('token', { session: false }),
  async function(req, res) {
    const myAnswers = await getMyAnswers(req.user.username);
    res.send(myAnswers);
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
