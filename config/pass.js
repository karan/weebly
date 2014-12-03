var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// bring in the schema for user
var User = require('mongoose').model('User'),
    Constants = require('./constants'),
    uuid = require('node-uuid');;

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Logic for google strategy
  passport.use(new GoogleStrategy({
    clientID : Constants.Google.KEY,
    clientSecret : Constants.Google.SECRET,
    callbackURL: Constants.Google.CALLBACK
  }, function(accessToken, refreshToken, profile, done) {

    User.findOne({gId : profile.id}, function(err, oldUser) {
      if (oldUser) {
        // found existing user
        return done(null, oldUser);
      }

      if (err) {
        // something bad happened
        return done(err);
      }

      // If user doesn't exist create a new one
      var newUser = new User({
        gId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        token: uuid.v4(),
        access_token: accessToken,
        refresh_token: refreshToken
      }).save(function(err, newUser) {
        if (err) throw err;
        return done(null, newUser);
      });
    });
  }));

}
