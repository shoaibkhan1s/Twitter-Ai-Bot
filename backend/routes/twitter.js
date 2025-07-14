const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/login", passport.authenticate("twitter"));

router.get(
  "/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/auth/twitter/failure",
  }),
  (req, res) => {
    // Token and Secret already attached to req.user by Passport
    req.session.token = req.user.token;
    req.session.secret = req.user.tokenSecret;

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
