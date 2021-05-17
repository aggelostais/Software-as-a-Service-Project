const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/events', function(req, res, next) {
  const event = req.body;

  let error = false;

  // Send event to Authenticator
  axios.post('http://localhost:3010/events', event)
      .catch(e => { error = true; });
  
  // Send event to Questions
  axios.post('http://localhost:3011/events', event)
      .catch(e => { error = true; });

  // Send event to Answers
  axios.post('http://localhost:3012/events', event)
      .catch(e => { error = true; });

  if(error){
    return res.status(500).send({status: 'Event propagation failed'});
  }

  res.status(200).send({status: 'Event successfully propagated'});
});

module.exports = router;
