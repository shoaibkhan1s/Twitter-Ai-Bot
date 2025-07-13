const express = require("express");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
const twitterRoutes = require("./routes/twitter");
const  postToTwitter= require("./utils/tweetPoster");
const generateCaption = require("./utils/caption").generateCaption;
const generateImagePrompt = require("./utils/promptMaker");
const fetch = require("node-fetch");
const fs = require("fs");
const sharp = require("sharp");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:3000/auth/twitter/callback",
    },
    (token, tokenSecret, profile, done) => {
      profile.token = token;
      profile.tokenSecret = tokenSecret;
      return done(null, profile);
    }
  )
);

app.use("/auth/twitter", twitterRoutes);

app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ user: req.user });
});

app.post("/tweet", async (req, res) => {
  try {
    const { token, secret, interest } = req.body;
    const caption = await generateCaption(interest);
    const prompt = await generateImagePrompt(caption);
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=51&model=flux`;

    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    fs.writeFileSync("image.png", buffer);

    await sharp("image.png")
      .metadata()
      .then(({ width, height }) => {
        return sharp("image.png")
          .extract({ left: 0, top: 0, width, height: height - 55 })
          .toFile("newImage.png");
      });

    await  postToTwitter( caption, "newImage.png",{token, secret});

    res.json({ success: true, caption });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Tweet failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});