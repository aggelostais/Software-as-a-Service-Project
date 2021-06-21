const express = require('express');
const axios = require('axios');
const router = express.Router();

const actions = {};

router.post('/serivceManagement', async function(req, res, next) {
  const { actionType, endpoint } = req.body;

  actions[actionType] = endpoint;
  console.log(actions);

  res.send('OK');
});

router.post('/serivceExecution', async function(req, res, next) {
  const { actionType, parameters } = req.body;

  let actionResult;

  if(actionType === 'Authorization'){
    try{
      actionResult = await axios.get(actions[actionType], { headers: {'Authorization': parameters[0]}});
      actionResult = actionResult.data.user.username;
    }
    catch(error){
      if (error.response) {
        actionResult = undefined;
      }
    }
    console.log(actionResult);
    return res.send({ user: actionResult});
  }

  if(actionType === 'ValidateQuestion'){
    try{
      actionResult = await axios.get(actions[actionType] + `/${parameters[0]}`);
      actionResult = actionResult.data;
    }
    catch(error){
      if (error.response) {
        actionResult = undefined;
      }
    }
    console.log(actionResult);
    return res.send({ result: actionResult });
  }

  res.send('OK');
});

module.exports = router;
