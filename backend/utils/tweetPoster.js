const fs = require('fs');
const { TwitterApi } = require('twitter-api-v2');

async function postToTwitter(caption, imagePath, { apiKey, apiSecret, accessToken, accessSecret }) {
  try {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const mediaData = fs.readFileSync(imagePath);
    const mediaId = await client.v1.uploadMedia(mediaData, { type: 'png' });

    const { data } = await client.v2.tweet({
      text: caption,
      media: { media_ids: [mediaId] },
    });

    console.log('✅ Tweet posted successfully! Tweet ID:', data.id);
  } catch (err) {
    console.error('❌ Failed to post tweet:', err);
    throw err;
  }
}

module.exports = postToTwitter;
