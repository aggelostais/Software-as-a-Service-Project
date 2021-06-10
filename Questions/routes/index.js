const express = require('express');
const axios = require('axios');
const { createQuestion, getQuestions,getQuestPerKey,getQuestPerDay, createEvent, deleteQuestion } = require('./queries');
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'secret-key';
const router = express.Router();

// Extract username from token
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
router.get('/questions/PerKeyword', async function(req, res) {
    const results = await getQuestPerKey();
    let perkeyword=[];
    for (let i = 0; i < results.length; i++) {
        perkeyword.push(results[i].keyword);
        perkeyword.push(results[i].related_questions);
    }
    res.send(perkeyword);
});

/* GET questions per day */
router.get('/questions/PerDay', async function(req, res) {
    const results = await getQuestPerDay();
    let perday=[];
    for (let i = 0; i < results.length; i++) {
        perday.push(results[i].date);
        perday.push(results[i].related_questions);
    }
    res.send(perday);
});

/* GET all questions. */
router.get('/questions', async function(req, res) {
  const results = await getQuestions();
  res.send(results);
});

/* Add new question */
router.post('/questions', 
  passport.authenticate('token', { session: false }),
  async function (req, res){
    let { title, keywords, content } = req.body; // gives title, keywords and content to body

    if(typeof keywords === 'string'){
      keywords = keywords.split(',');
    }

    // Remove whitespaces between separator ,
    keywords = keywords.map(keyword => {
       return keyword.trim();
     });

    let new_question = {
      title,
      keywords,
      content,
    };

    const {insertId} = await createQuestion(new_question);

    new_question = {
      id: insertId,
      title,
      keywords,
      content,
    };

    // Send a QuestionCreated object in the event-bus service
    axios.post('http://localhost:3005/events', {
      type: 'QuestionCreated',
      data: {
        id: insertId
      }
    });

    res.status(201).send(new_question);
});

router.delete('/questions/:questionId', 
  passport.authenticate('token', { session: false }),
  async function(req, res){
    const questionId = req.params.questionId;

    const deleteRes = await deleteQuestion(questionId);

    if(deleteRes.affectedRows > 0){

      axios.post('http://localhost:3005/events', {
        type: 'QuestionDeleted',
        data: {
          id: questionId
        }
      });

      return res.status(200).send("OK, question deleted");
    }
    else{
      return res.status(404).send("That question was not found!");
    }
});

router.post('/events', function (req, res) {
  console.log('Event Received:', req.body.type);

  createEvent(req.body);

  res.send({});
});

module.exports = router;
