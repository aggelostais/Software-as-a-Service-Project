const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET home page. */
router.post('/serivceExecution', async function(req, res, next) {
  const { origin, destination, actionType, parameters } = req.body;

  let actionResult;
  if(actionType === 'Authorization'){
    try{
      actionResult = await axios.get('http://localhost:3010/whoami', { headers: {'Authorization': parameters[0]}});
      actionResult = actionResult.status;
    }
    catch(error){
      if (error.response) {
        actionResult = error.response.status;
      }
    }
    console.log(actionResult);
    return res.send({ resultStatus: actionResult});
  }

  res.send('OK');
});

module.exports = router;
