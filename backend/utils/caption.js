require("dotenv").config({ path: __dirname + "/../.env", override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function generateCaption(interest) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a viral tweet generator. Generate a tweet in the category: "${interest}".

Rules:
– Style: Funny, sarcastic, savage, motivational, or relatable.
– Tone: Human, chill, no robotic or corporate tone.
– Length: Randomly between 5 and 150 characters.
– Include 2–3 trending or quirky hashtags.
– Do NOT mention category in the tweet.
– Strictly avoid political, offensive, or illegal content.`,
      
      config: {
        systemInstruction: `
You're a Twitter ghostwriter.

Every time you're called:
– Generate a post related to "${interest}".
– Tone: Witty, weird, savage, chill, motivating.
– Length: 5–150 characters.
– Add 2–3 quirky or trending hashtags.
– No political, sensitive, or illegal content.
– Don't mention category in tweet.
– Output only the tweet.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("❌ Error generating caption:", error);
    throw error;
  }
}

module.exports = {
  generateCaption
};
