const express = require('express');
const axios = require('axios');
const { createQuestion, getQuestions, getMyQuestions, deleteQuestion } = require('./queries');
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


/* GET my Questions */
router.get('/questions/myQuestions', 
  passport.authenticate('token', { session: false }),
  async function(req, res) {
    const myQuestions = await getMyQuestions(req.user.username);
    res.send(myQuestions);
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
      creator: req.user.username
    };

    const query = await createQuestion(new_question);

    new_question = {
      id: query.id,
      timestamp: query.timestamp,
      title,
      keywords,
      content,
      creator: req.user.username
    };


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

module.exports = router;
