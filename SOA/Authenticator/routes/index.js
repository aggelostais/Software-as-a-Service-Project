const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'secret-key';

// Gets username from token
passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done){
        return done(null, { username: token.username});
    }
));

// POST Sign-in
router.post('/signin',
    async function(req, res){
    try{
        const {data:result}= await axios.post(`http://localhost:3020/signIn`, {username:req.body.username, password:req.body.password});
        console.log(result);

        if (result.token==='Invalid password.')
            return res.status(400).send('Invalid password.');
        if (result.token==='User not found.')
            return res.status(402).send('User not found.');

        return res.json(result);
    }
    catch (e){
        console.log('Sign In Error: ' + e);
        res.status(400).send('error');
    }
});

// POST Sign-up
router.post('/signup',
    async function(req, res){
    try{
        const username = req.body.username;
        const hashed_password = await bcrypt.hash(req.body.password, 10);

        const {data:result}= await axios.post(`http://localhost:3020/signUp`, {username:username, password:hashed_password});
        console.log(result);

        // Username already exists
        if(!result){
            return res.status(200).
                send({result:'Username already exists, please try something else.',status:false});
        }

        // User successfully registered
        return res.json({
            result: 'User ' + req.body.username + ' welcome!', status:true});
    }
    catch(e){
        console.log('Sign Up Error: ' + e);
        res.status(400).send('error');
    }
});

// GET whoami
router.get('/whoami',
    passport.authenticate('token', { session: false }),
    function(req, res){
        res.json({
            user: req.user
        });
    });

module.exports = router;