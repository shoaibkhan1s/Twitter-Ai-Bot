require('dotenv').config({ path: __dirname + '/../.env', override: true });
const fs = require('fs');
const path = require('path');
const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});

async function postToTwitter(caption, imagePath) {
  try {
    const mediaData = fs.readFileSync(imagePath);
    const mediaId = await client.v1.uploadMedia(mediaData, { type: 'png' });

    const { data } = await client.v2.tweet({
      text: caption,
      media: { media_ids: [mediaId] },
    });

    console.log('✅ Tweet posted successfully! Tweet ID:', data.id);
  } catch (err) {
    console.error('❌ Failed to post tweet:', err);
  }
}


module.exports = postToTwitter;
