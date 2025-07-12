// Example 1: Image Generation

const fs = require("fs");
const fetch = require("node-fetch");
const sharp = require("sharp");
const postToTwitter = require("./utils/tweetPoster");
const generateImagePrompt = require("./utils/promptMaker");
const { caption } = require("./utils/caption");

async function downloadImage(imageUrl, captionText) {
  try {
    const response = await fetch(imageUrl);

    const buffer = await response.buffer();

    fs.writeFileSync("image.png", buffer);

    // Input/output path
    const inputImagePath = "image.png";
    const outputImagePath = "newImage.png";

    await sharp(inputImagePath)
      .metadata()
      .then(({ width, height }) => {
        return sharp(inputImagePath)
          .extract({ left: 0, top: 0, width: width, height: height - 55 }) // crop 55px from bottom
          .toFile(outputImagePath);
      })
      .then(() => {
        console.log("✅ Image cropped, ready to post to Twitter");
      })
      .catch((err) => {
        console.error("❌ Error cropping image:", err);
      });

    console.log("Download Completed");

    await postToTwitter(captionText, "newImage.png");
    console.log("Tweet posted with image successfully!");
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

async function main() {
  try {
    const prompt = await generateImagePrompt();
    console.log("Generated Prompt:", prompt);

    const captionText = await caption;
    console.log("Generated Caption:", captionText);

    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&seed=51&model=flux`;
    await downloadImage(imageUrl, captionText); // Download the image
  } catch (error) {
    console.error("Error in main function:", error);
  }
}
// 🔁 Cron job: every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("🕒 Running auto-post job...");
  main();
});

