const mysql = require('mysql');
const util = require('util');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 3306,
  user            : 'saas_user',
  password        : 'saas_user',
  database        : 'saas_events',
  dateStrings     : true
});

pool.query = util.promisify(pool.query) // Magic happens here.

const createEvent = async (event) => {
    try{
        const data = (JSON.stringify(event.data)).replace(/"/g, "\'");
        let query = `INSERT INTO event(type, data) VALUES("${event.type}", "${data}");`;
        // console.log(query);

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));

        return res;
        
    }catch(err){
        throw err;
    }
}

const getNewEvents = async (event_id, timestamp) => {
    try{
        let query = `SELECT * FROM event WHERE id > ${event_id} AND timestamp >= "${timestamp}";`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));
        
        return res;
        
    }catch(err){
        throw err;
    }
}

const getAll = async () => {
    try{
        let query = `SELECT * FROM event;`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));
        
        return res;
        
    }catch(err){
        throw err;
    }
}

const getEvent = async (id) => {
    try{
        let query = `SELECT * FROM event WHERE id = ${id};`;

        let res = await pool.query(query);

        // Convert OkPacket to plain object
        res = JSON.parse(JSON.stringify(res));
        
        return res[0];
        
    }catch(err){
        throw err;
    }
}

module.exports = {
    createEvent,
    getNewEvents,
    getAll, 
    getEvent
}