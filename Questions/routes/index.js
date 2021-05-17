const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const router = express.Router();

const questions = {};

/* GET all questions. */
router.get('/questions', function(req, res) {
  res.send(questions);
});

router.post('/questions', function (req, res){
  const id = randomBytes(4).toString('hex');
  let { title, keywords, content } = req.body;

  if(typeof keywords === 'string'){
    keywords = keywords.split(',');
  }

  // Remove whitespaces
  keywords = keywords.map(keyword => {
    return keyword.replace(/\s/g, '');
  });

  questions[id] = {
    id,
    title,
    keywords,
    content,
  };

  axios.post('http://localhost:3005/events', {
    type: 'QuestionCreated',
    data: {
      id
    }
  });

  res.status(201).send(questions[id]);
});

router.post('/events', function (req, res) {
  console.log('Event Received:', req.body.type);

  res.send({});
});

module.exports = router;
