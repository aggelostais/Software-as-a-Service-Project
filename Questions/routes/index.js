const express = require('express');
const { randomBytes } = require('crypto');
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

  res.status(201).send(questions[id]);
});

module.exports = router;
