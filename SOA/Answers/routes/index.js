const express = require('express');
const axios = require('axios');
const router = express.Router();

const AuthorizedToken = async (token) => {
    reqBody = {
        actionType: 'Authorization',
        parameters: [token]
    }
    const authorizationRes = await axios.post('http://localhost:4000/serviceExecution', reqBody);
    return authorizationRes.data.user;
}

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
    async function (req, res){
        const questionId = req.params.id;
        const token = req.header('Authorization');

        // Authorize token
        const user = await AuthorizedToken(token);
        if(!user){
            return res.status(401).send('Unauthorized');
        }

        // If questionId provided is not valid
        // Do some checking
        const {data:questionIsValid}= await axios.post(`http://localhost:3020/questionValid`, {question_id:questionId});
        if(!questionIsValid){
            console.log(`Asked for questionId = ${questionId}, but that id was not found`);
            return res.status(404).send("The requested id was not found!");
        }

        const {answerContent} = req.body;

        console.log("User:"+user+", answer: "+answerContent);

        const {insertId} = await axios.post(`http://localhost:3020/createAnswer`, {question_id:questionId,answer_content:answerContent,creator:user});

        res.status(201).send({insertId});
});

router.delete('/questions/:questionId/answers/:answerId', 
    async function(req, res){
        const questionId = req.params.questionId;
        const answerId = req.params.answerId;
        const token = req.header('Authorization');

        // Authorize token
        const user = await AuthorizedToken(token);
        if(!user){
            return res.status(401).send('Unauthorized');
        }

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
  async function(req, res) {
    const token = req.header('Authorization');
    // Authorize token
    const user = await AuthorizedToken(token);
    if(!user){
        return res.status(401).send('Unauthorized');
    }

    const {data:myAnswers}= await axios.post(`http://localhost:3020/getMyAnswers`, {user});
    res.send(myAnswers);
});

module.exports = router;
