const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET home page. */
router.post('/serivceExecution', async function(req, res, next) {
  const { actionType, parameters } = req.body;

  let actionResult;
  if(actionType === 'Authorization'){
    try{
      actionResult = await axios.get('http://localhost:3010/whoami', { headers: {'Authorization': parameters[0]}});
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

  res.send('OK');
});

module.exports = router;
