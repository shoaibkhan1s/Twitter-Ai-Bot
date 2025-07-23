const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.model");

router.get("/login", passport.authenticate("twitter"))
router.get(
  "/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/auth/twitter/failure",
  }),
 async (req, res) => {
    // Token and Secret already attached to req.user by Passport
    req.session.token = req.user.token;
    req.session.secret = req.user.tokenSecret;
 
    const user = new User({
      username: req.user.username,
      displayName: req.user.displayName,
      twitterId: req.user.id,
      avatar: req.user.photos[0].value,
    });
await user.save()
console.log(" user is here : ", user)
    // Redirect without token/secret in URL
    res.redirect("http://localhost:5173");
  }
);

router.get("/failure", (req, res) => {
  res.send("❌ Twitter login failed.");
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173");
  });
});

module.exports = router;
