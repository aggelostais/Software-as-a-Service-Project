const express = require('express');
const { default: axios } = require('axios');
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

    const {data:answers}= await axios.post(`http://localhost:3020/getAnswers`, {question_id:questionId});
    console.log(answers);
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

        // If questionId provided is not valid
        // Do some checking
        const {data:questionIsValid}= await axios.post(`http://localhost:3020/questionValid`, {question_id:questionId});
        if(!questionIsValid){
            console.log(`Asked for questionId = ${questionId}, but that id was not found`);
            return res.status(404).send("The requested id was not found!");
        }

        const user=req.user.username;
        const {answerContent} = req.body;

        console.log("User:"+user+", answer: "+answerContent);

        const {insertId} = await axios.post(`http://localhost:3020/createAnswer`, {question_id:questionId,answer_content:answerContent,creator:user});

        res.status(201).send({insertId});
});

router.delete('/questions/:questionId/answers/:answerId', 
    passport.authenticate('token', { session: false }),
    async function(req, res){
        const questionId = req.params.questionId;
        const answerId = req.params.answerId;

        const {data:deleteRes}= await axios.post(`http://localhost:3020/deleteAnswer`, {question_id:questionId,answer_id:answerId});

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
    const user=req.user.username;
    const {data:myAnswers}= await axios.post(`http://localhost:3020/getMyAnswers`, {user});
    res.send(myAnswers);
});

module.exports = router;
