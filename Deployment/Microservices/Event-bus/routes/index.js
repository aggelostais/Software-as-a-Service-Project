const express = require('express');
const axios = require('axios');
const { createEvent, getNewEvents, getAll, getEvent } = require('./queries');
const router = express.Router();

// Gets an event from a Publisher and send it to Subscribers
router.post('/events', async function(req, res, next) {
  const event = req.body;

  let error = false;

  // Stores event in database
  const createdEventRes = await createEvent(event).catch(e => { error = true; });
  const createdEventId = createdEventRes.insertId;

  let createdEvent = await getEvent(createdEventId);
  createdEvent = {
    ...createdEvent,
    data : JSON.parse(createdEvent.data.replace(/'/g, "\""))
  };

  // Send event to Subscriber: Answers Service
  axios.post('https://microservices-answers.herokuapp.com/events', createdEvent)
      .catch(e => { error = true; });

  // Send event to Subscriber: Statistics Service
  axios.post('https://microservices-statistics.herokuapp.com/events', createdEvent)
      .catch(e => { error = true; });

  if(error){
    return res.status(500).send({status: 'Event propagation failed'});
  }

  res.status(200).send({status: 'Event successfully propagated'});
});

// Fetches events from certain id to requested service
router.post('/fetchEvents', async function(req, res) {
  const { id, timestamp, requester} = req.body;

  let events = await getNewEvents(id, timestamp);
  // const events = await getAll();
  // console.log(events);

  events = events.map(event => {
    let data = event.data.replace(/'/g, "\"");
    data = JSON.parse(data);

    return {
      id : event.id,
      timestamp : event.timestamp,
      type : event.type,
      data,
    };
  });

  // console.log(events);

  // Makes post request for each required event to the service asking for them
  events.forEach(event => {
    axios.post(requester + '/events', event)
  });

  res.send(events);

});

module.exports = router;
