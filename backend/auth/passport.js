const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
require("dotenv").config();

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (token, tokenSecret, profile, cb) => {
      const user = {
        id: profile.id,
        username: profile.username,
        token,
        tokenSecret,
      };
      return cb(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
