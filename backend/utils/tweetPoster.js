const fs = require("fs");
const { TwitterApi } = require("twitter-api-v2");

async function postToTwitter(caption, imagePath, { token, secret }) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: token,
    accessSecret: secret,
  });
  let mediaId = null;
  if (imagePath) {
    const mediaData = fs.readFileSync(imagePath);
    mediaId = await client.v1.uploadMedia(mediaData, {
      mimeType: "image/png",
    });
}

  const tweetOptions = {
    text: caption,
  };
  if(mediaId) {
    tweetOptions.media={ media_ids: [mediaId] };
  }
const { data } = await client.v2.tweet(tweetOptions);
  return data.id;
  console.log("✅ Tweet posted!", data.id);
}


async function postCaptionToTwitter(caption, { token, secret }) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: token,
    accessSecret: secret,
  });

  const { data } = await client.v2.tweet({
    text: caption,
  });
  return data.id;
  console.log("✅ Tweet posted!", data.id);
}


module.exports = { postToTwitter, postCaptionToTwitter };
