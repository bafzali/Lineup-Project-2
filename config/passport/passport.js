const db = require('../../models');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');

// Configure the local strategy for use by Passport.
// User login
passport.use('local-signin', new Strategy(
  {
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
  function(req, userName, password, cb) {
    // console.log(userName);
    // console.log(password);

    // bCrypt hashed password check function
    const isValidPassword = function(userPass, enteredPass) {
      console.log('checking password');
      return bCrypt.compareSync(enteredPass, userPass);
    };

    db.People.findOne({ where: { userName: userName } }).then(function (user) {
      if (!user) {
        console.log('checking for username');
        console.log('userName does not exist');
        return cb(null, false);
      }
      if (!isValidPassword(user.password, password)) {
        console.log('Incorrect password.');
        return cb(null, false);
      }
      console.log('looked up username');
      return cb(null, user);
    });
  },
));

// Configure the local strategy for use by Passport.
passport.serializeUser(function(user, cb) {
  console.log(`user id: ${user.id}`);
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  console.log('deserialized user');
  db.People.findOne({ where: { id: id } }).then(function(user) {
    // if (err) { return cb(err); }
    cb(null, user);
  });
});

module.exports = passport;
