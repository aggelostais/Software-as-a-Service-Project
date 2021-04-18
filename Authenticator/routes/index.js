const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'secret-key';

passport.use('signin', new LocalStrategy(function(username, password, done){
  // Check if login is valid
  if(username !== 'admin' || password !== 'secret'){
    return done(null, false);
  }
  return done(null, {username: username});
}));

passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done){
        return done(null, { username: token.username });
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

// GET whoami
router.get('/whoami',
    passport.authenticate('token', { session: false }),
    function(req, res){
        res.json({
            user: req.user
        });
    });

module.exports = router;
