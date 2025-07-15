const express = require("express");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const fs = require("fs");
const sharp = require("sharp");

const twitterRoutes = require("./routes/twitter");
const postToTwitter = require("./utils/tweetPoster");
const generateCaption = require("./utils/caption").generateCaption;
const generateImagePrompt = require("./utils/promptMaker");

dotenv.config();
const app = express();


// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport setup
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

// Routes
app.use("/auth/twitter", twitterRoutes);

app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ user: req.user });
});

// Main tweet posting route
app.post("/tweet/post", async (req, res) => {
  try {
    const { token, secret, msg, image } = req.body;

    await postToTwitter(msg, "newImage.png", { token, secret });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Tweet failed" });
  }
});

// Main tweet posting route
app.post("/tweet", async (req, res) => {
  try {
    const { token, secret, interest, captionType, gender } = req.body;

    const caption = await generateCaption(interest, captionType);
    const prompt = await generateImagePrompt(caption, gender, interest);
    console.log(prompt);
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&seed=77&model=turbo`;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    fs.writeFileSync("image.png", buffer);

    const image = await sharp("image.png")
      .metadata()
      .then(({ width, height }) =>
        sharp("image.png")
          .extract({ left: 0, top: 0, width, height: height - 55 })
          .toFile("newImage.png")
      );
    const newBuffer = fs.readFileSync("newImage.png");
    const base64Image = newBuffer.toString("base64");
    const mimeType = "image/png";

    // await postToTwitter(caption, "newImage.png", { token, secret });

    res.json({
      success: true,
      caption,
      image: `data:${mimeType};base64,${base64Image}`,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Tweet failed" });
  }
});

// New secure route to serve token/secret from session
app.get("/auth/twitter/session", (req, res) => {
  if (req.session.token && req.session.secret) {
    res.json({
      user: req.user,
      token: req.session.token,
      secret: req.session.secret,
    });
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
