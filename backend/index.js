const express = require("express");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const fs = require("fs");
const sharp = require("sharp");
const multer = require("multer");
const path = require("path");
const { isLoggedIn } = require("./middleware");
const { postCaptionToTwitter, postToTwitter } = require("./utils/tweetPoster");
const twitterRoutes = require("./routes/twitter");
const generateCaption = require("./utils/caption").generateCaption;
const generateImagePrompt = require("./utils/promptMaker");
const Post = require("./models/post.model");
const User = require("./models/user.model");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressErrorHandler");
dotenv.config();
const app = express();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// Multer setup (not used for AI image, but kept for future use)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// CORS setup for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Serve uploads folder statically
app.use("/uploads", express.static("uploads"));

// Passport setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
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

// Main tweet posting route with AI-generated image
app.post("/tweet/post", isLoggedIn, async (req, res) => {
  try {
    const { token, secret, msg, filename } = req.body;
    let imageUrl = "";
    let imagePath = null;

    if (filename) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
      imagePath = path.join("uploads", filename);
    }
    let user = await User.findOne({ twitterId: req.user.id });

    let tweetId = await postToTwitter(msg, imagePath, { token, secret });

    let post = new Post({
      user: user?._id,
      tweetId: tweetId,
      caption: msg,
      imageUrl: imageUrl,
      createdAt: new Date(),
    });
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Tweet failed" });
  }
});

// main route for posting caption to Twitter (no image)
app.post("/tweet/caption", isLoggedIn, async (req, res) => {
  try {
    const { token, secret, msg } = req.body;
    const tweetId = await postCaptionToTwitter(msg, { token, secret });
    res.json({ success: true, message: "Caption posted successfully!" });
    let user = await User.findOne({ twitterId: req.user.id });
    let post = new Post({
      user: user?._id,
      tweetId: tweetId,
      caption: msg,
      imageUrl: "",
      createdAt: new Date(),
    });
    await post.save();
  } catch (err) {
    console.error("❌ Error:", err);
    
  }
});

// Main tweet generation route (generates image and caption)
app.post("/tweet", isLoggedIn, async (req, res) => {
  try {
    const { token, secret, interest, captionType, gender, language } = req.body;

    const caption = await generateCaption(interest, captionType, language);
    const prompt = await generateImagePrompt(caption, gender, interest);
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&seed=77&model=turbo`;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Save image to uploads folder
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    const filename = `${Date.now()}_generated.png`;
    const filepath = path.join("uploads", filename);
    fs.writeFileSync(filepath, buffer);

    
    await sharp(filepath)
      .metadata()
      .then(({ width, height }) =>
        sharp(filepath)
          .extract({ left: 0, top: 0, width, height: height - 55 })
          .toFile(path.join("uploads", "cropped_" + filename))
      );

    const croppedFilename = "cropped_" + filename;
    const croppedPath = path.join("uploads", croppedFilename);
    const newBuffer = fs.readFileSync(croppedPath);
    const base64Image = newBuffer.toString("base64");
    const mimeType = "image/png";
    const publicImageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${croppedFilename}`;

    res.json({
      success: true,
      caption,
      image: `data:${mimeType};base64,${base64Image}`,
      imageUrl: publicImageUrl,
      filename: croppedFilename, // <-- Send filename to frontend
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Tweet failed" });
  }
});

app.get("/seeTweets", isLoggedIn, async (req, res) => {
  try {
    let user = await User.findOne({ twitterId: req.user?.id });
    let posts = await Post.find({ user: user?._id });
res.json(posts)

  } catch (err) {
    console.log("error in /seeTweets : ", err);
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

//error in /seeTweets :  Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
