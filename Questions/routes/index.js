const express = require('express');
const axios = require('axios');
const { createQuestion, getQuestions, createEvent } = require('./queries');
const router = express.Router();

/* GET all questions. */
router.get('/questions', async function(req, res) {
  const results = await getQuestions();
  // console.log(results);
  res.send(results);
});

router.post('/questions', async function (req, res){
  let { title, keywords, content } = req.body;

  if(typeof keywords === 'string'){
    keywords = keywords.split(',');
  }

  // Remove whitespaces
  keywords = keywords.map(keyword => {
    return keyword.replace(/\s/g, '');
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

  axios.post('http://localhost:3005/events', {
    type: 'QuestionCreated',
    data: {
      id: insertId
    }
  });

  res.status(201).send(new_question);
});

router.post('/events', function (req, res) {
  console.log('Event Received:', req.body.type);

  createEvent(req.body);

  res.send({});
});

module.exports = router;
