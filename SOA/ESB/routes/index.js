const express = require('express');
const axios = require('axios');
const router = express.Router();

const services={}; // Service Repository

//  Service and (optional) action provided to other services is registered in Service Bus
router.post('/serviceManagement', async function(req, res, next) {
  const { service, actionType, actionEndpoint } = req.body;

   // If service was registered in the past delete
  for (const key of Object.keys(services)) {
    if(service===key)
      delete services[key];
  }

   // Service has action to provide
  if (actionType !== undefined) {
    const temp={}
    temp[actionType]=actionEndpoint
    services[service] = temp;
  }
  else
    services[service]=null;

  console.log('Registered Services:');
  console.log(services);

  res.send('OK');
});

// Returns Service Repository
router.get('/serviceDiscovery', async function(req, res, next) {
  res.send(services);
});

router.post('/serviceExecution', async function(req, res, next) {
  const { actionType, parameters } = req.body;
  let req_service,actionResult;

  if(actionType === 'TokenAuthorization'){
    try{
      actionResult = await axios.get(services['Authorization'][actionType], { headers: {'Authorization': parameters[0]}});
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

  else {
  for (const key of Object.keys(services)) {
    if(Object.keys(services[key])[0]===actionType)
      req_service=key;
  }

    try{
      actionResult = await axios.get(services[req_service][actionType] + `/${parameters[0]}`);
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

});

module.exports = router;
