const express = require('express');
const axios = require('axios');
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

/* GET my Questions */
router.get('/questions/myQuestions', 
  passport.authenticate('token', { session: false }),
  async function(req, res) {
    const user=req.user.username;
    const {data:result}= await axios.post(`http://localhost:3020/getMyQuestions`, {user});
    res.send(result);
});

/* GET questions per keyword */
router.get('/questions/PerKeyword', async function(req, res) {
    const {data:results}= await axios.post(`http://localhost:3020/getQuestPerKey`);
    let perkeyword=[];
    for (let i = 0; i < results.length; i++) {
        perkeyword.push(results[i].keyword);
        perkeyword.push(results[i].related_questions);
    }
    res.send(perkeyword);
});

/* GET questions per day */
router.get('/questions/PerDay', async function(req, res) {
    const {data:results}= await axios.post(`http://localhost:3020/getQuestPerDay`);
    console.log(results);
    let perday=[];
    for (let i = 0; i < results.length; i++) {
        perday.push(results[i].date);
        perday.push(results[i].related_questions);
    }
    res.send(perday);
});

/* GET all questions. */
router.get('/questions', async function(req, res) {
    const {data:results}= await axios.post(`http://localhost:3020/getQuestions`);
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

    const {data:{insertId}} = await axios.post(`http://localhost:3020/createQuestion`, {new_question});

    new_question = {
      id: insertId,
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

    const {data:deleteRes} = await axios.post(`http://localhost:3020/deleteQuestion`,{questionId});

    if(deleteRes.affectedRows > 0){

      return res.status(200).send("OK, question deleted");
    }
    else{
      return res.status(404).send("That question was not found!");
    }
});

module.exports = router;
