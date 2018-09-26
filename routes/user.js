const express = require('express');
const router  = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');
   
router.post('/', (req, res, next) => {
  
  const { email, password } = req.body;  
  User.findOne({ email, password: null })
    .then((user) => {
       if (user) {        
        bcrypt.genSalt(10, (err, salt) => {                       
            bcrypt.hash(password, salt, null, (err, hash) => {                      
                console.log(hash);                
              User.findOneAndUpdate({ email }, { password: hash })
                .then((updatedUser) => res.send({ updatedUser }))
                .catch((error) => res.status(500).json(error))             
            });
        });

        // User.findOneAndUpdate({ email }, { password })
        // .then((updatedUser) => res.send({ updatedUser }))
        // .catch((error) => res.status(500).json(error))
       } else {
        const newUser = new User(req.body);      
        newUser.save(
            function (err) {     
            if (err) {
              res.status(500).json(err);
            }
            res.send({ user });
            }
        ); 
       }
    })
    .catch((error) => res.status(500).json(error))
});

module.exports = router;

// router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
//   Client.find({}, 'looking_for styles budget hours occupation', function (err, shoppers) {
//     if (err) {
//       res.status(500).send(err)
//     }
//     res.send({ shopper });
//   });
// });

// router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
//   Client.findOne({ _id: req.params.uid }, 'looking_for styles budget hours occupation', function (err, shoppers) {
//     if (err) {
//       res.status(500).send(err)
//     }
//     res.send({ shopper });
//   });
// });

// module.exports = router;