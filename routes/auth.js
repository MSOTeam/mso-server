const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { generateToken, sendToken } = require('../utils/token');

router.route('/auth/google')
    .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        next();
}, generateToken, sendToken);

router.post('/login', (req, res, next) => {

    passport.authenticate(['local'], {session: false}, (err, user, info) => {        
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }

       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }

           const token = jwt.sign(user.toJSON(), 'jwt_secret', { expiresIn: "15m" });        
           return res.json({user, token});
        });
    })(req, res);
});

module.exports = router;