const express = require('express');
const methods = require('./queries');
const router = express.Router();

router.post('/:name',
  async function(req, res) {

    console.log(req.body);
    const result= await methods[req.params.name](req.body);
    res.send(result);
});

module.exports = router;
