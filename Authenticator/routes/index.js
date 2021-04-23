const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'secret-key';

let users = [
    { username: 'admin', password: 'secret' }
]

passport.use('signin', new LocalStrategy(function(username, password, done){

    // Check if user exists and sign in is successful
    const user = users.find((user) => {
        return user.username === username && user.password === password;
    });

    if(!user){
        return done(null, false);
    }
    return done(null, {username: username});
}));

passport.use('signup', new LocalStrategy(function(username, password, done){

    // Check if username already exists
    const user = users.find((user) => {
        return user.username === username;
    });

    if(!user){
        // Register new user
        users.push({ username: username, password: password});
        return done(null, {username: username, status:true});
    }

    return done(null, { status: false });
}));

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
    passport.authenticate('signin', { session: false }),
    function(req, res){

        res.json({
            token: jwt.sign(req.user, JWT_SECRET, {expiresIn: 3600})
        });
    });

// POST Sign-up
router.post('/signup',
    passport.authenticate('signup', { session: false }),
    function(req, res){
        console.log(users);
        if(req.user.status){
            // User successfully registered
            res.json({
                result: 'User ' + req.user.username + ' welcome!', status:true
            });
        }
        else{
            res.json({
                result: 'Username already exists, please try something else.', status:false
            });
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