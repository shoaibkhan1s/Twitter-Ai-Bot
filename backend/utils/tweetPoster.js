const fs = require("fs");
const { TwitterApi } = require("twitter-api-v2");

async function postToTwitter(caption, imagePath, { token, secret }) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: token,
    accessSecret: secret,
  });

  const mediaData = fs.readFileSync(imagePath);
  const mediaId = await client.v1.uploadMedia(mediaData, { mimeType: "image/png" });

  const { data } = await client.v2.tweet({
    text: caption,
    media: { media_ids: [mediaId] },
  });

  console.log("✅ Tweet posted!", data.id);
}

module.exports = postToTwitter;
