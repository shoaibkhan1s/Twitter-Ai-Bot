const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const fetch = require("node-fetch");
const fs = require("fs");
const sharp = require("sharp");

const postToTwitter = require("./utils/tweetPoster");
const generateImagePrompt = require("./utils/promptMaker");
const { generateCaption } = require("./utils/caption");

async function downloadImage(imageUrl, captionText, twitterCreds) {
  const inputPath = "image.png";
  const outputPath = "newImage.png";

  // 🔥 Delete existing image files if they exist (safe cleanup)
  try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch (e) {}
  try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch (e) {}

  const response = await fetch(imageUrl);
  const buffer = await response.buffer();
  fs.writeFileSync(inputPath, buffer);

  await sharp(inputPath)
    .metadata()
    .then(({ width, height }) => {
      return sharp(inputPath)
        .extract({ left: 0, top: 0, width: width, height: height - 55 })
        .toFile(outputPath);
    });

  console.log("✅ Image ready to tweet");

  await postToTwitter(captionText, outputPath, twitterCreds);
}


// 🔥 API route to handle frontend request
app.post('/generate-post', async (req, res) => {
  const { interest, apiKey, apiSecret, accessToken, accessSecret } = req.body;

  try {
    const captionText = await generateCaption(interest);
    console.log("📝 Caption:", captionText);

    const imagePrompt = await generateImagePrompt(captionText);
    console.log("🎨 Image Prompt:", imagePrompt);

    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&seed=51&model=flux`;

    await downloadImage(imageUrl, captionText, {
      apiKey,
      apiSecret,
      accessToken,
      accessSecret
    });

    res.json({ success: true, message: "Post tweeted successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong while posting." });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
