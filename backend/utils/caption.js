require("dotenv").config({ path: __dirname + "/../.env", override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateCaption(interest, tone = "funny",language) {
  try {
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a tweet ghostwriter.

Write 1 viral tweet in category: "${interest}".
Tone should be: "${tone}".
tweet must be in ${language} language.
Length: 5–150 characters.
Avoid hashtags like #politics or anything controversial.
if you want you can also use 4-5 words tweet but not always.

Style:
– Human, chill, funny, savage, or relatable.
– Include 2–3 trending hashtags.
– Do NOT mention category/interest name.
– Output ONLY the tweet.`,
      config: {
        systemInstruction: `
Generate a single viral tweet.
Tone: ${tone}. Topic: ${interest}.language: ${language}.
Add 2–3 quirky, relatable hashtags.
Avoid sensitive, political, or NSFW content.
Keep it clean, chill, and short.
Output ONLY the tweet.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("❌ Error generating caption:", error);
    throw error;
  }
}

module.exports = {
  generateCaption,
};
