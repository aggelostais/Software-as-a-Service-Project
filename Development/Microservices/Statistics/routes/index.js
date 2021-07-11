const express = require('express');
const axios = require('axios');
const { createQuestion,createAnswer, createKeyword, getQuestPerKey,getQuestPerDay,getMyQuestions,getMyAnswers, createEvent } = require('./queries');
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'secret-key';
const router = express.Router();

// Validate token and extract username from token
passport.use('token', new JWTstrategy(
  {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  },
  function(token, done){
      return done(null, { username: token.username});
  }
));

/* GET questions per keyword */
router.get('/questionsPerKeyword', async function(req, res) {
    const results = await getQuestPerKey();
    let perkeyword=[];
    for (let i = 0; i < results.length; i++) {
        perkeyword.push(results[i].keyword);
        perkeyword.push(results[i].related_questions);
    }
    res.send(perkeyword);
});

/* GET questions per day */
router.get('/questionsPerDay', async function(req, res) {
    const results = await getQuestPerDay();
    let perday=[];
    for (let i = 0; i < results.length; i++) {
        perday.push(results[i].date);
        perday.push(results[i].related_questions);
    }
    res.send(perday);
});

/* GET my Questions (without question content): Currently not used endpoint */
router.get('/myQuestions_general',
    passport.authenticate('token', { session: false }),
    async function(req, res) {
        const myQuestions = await getMyQuestions(req.user.username);
        res.send(myQuestions);
    });

/* GET my Answers (without answer content): Currently not used endpoint */
router.get('/myAnswers_general',
    passport.authenticate('token', { session: false }),
    async function(req, res) {
        const myAnswers = await getMyAnswers(req.user.username);
        res.send(myAnswers);
    });


// Update database according to events created
router.post('/events', function (req, res) {
    console.log('Event Received:', req.body.type);
    createEvent(req.body);

    const { type, data } = req.body;
    console.log(req.body);

    if (type === 'QuestionCreated') {
        createQuestion(data.id, data.timestamp,data.creator);
    }
    else if (type === 'KeywordCreated') {
        createKeyword(data.id,data.question_id,data.keyword);
    }
    else if (type === 'AnswerCreated') {
        createAnswer(data.id,data.question_id,data.creator,data.timestamp);
    }

    res.send({});
});

module.exports = router;
