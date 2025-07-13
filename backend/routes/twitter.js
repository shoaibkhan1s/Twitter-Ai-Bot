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
    const { token, tokenSecret } = req.user;
    res.redirect(`http://localhost:5173?token=${token}&secret=${tokenSecret}`);
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
