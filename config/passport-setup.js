const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
require("dotenv").config();
const User = require("../models/user-model");

const { CLIENT_ID, SECRET_KEY } = process.env;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google stratey
      callbackURL: "/auth/google/redirect",
      clientID: CLIENT_ID,
      clientSecret: SECRET_KEY,
    },
    function async(accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.displayName,
            username: `${profile.id}`,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              done(null, currentUser);
            });
        }
      });
    }
  )
);
