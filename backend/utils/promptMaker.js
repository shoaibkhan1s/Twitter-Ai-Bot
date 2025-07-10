require('dotenv').config({ path: __dirname + '/../.env', override: true });
const captionPromise = require('./geminiai').caption;
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImagePrompt() {
    const caption = await captionPromise;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a detailed image generation prompt for Stable Diffusion based on this tweet: "${caption}". 
The prompt should vividly describe the scene with details about setting, background, lighting, mood, style, and visual composition. 
Make it futuristic, techy, or imaginative. Do not mention the original text. Keep it within 60 words. 
Add this line at the end: "The image must be 1:1 in aspect ratio."`,
    config: {
      systemInstruction: `You're a professional prompt engineer who turns short tech tweet captions into vivid, engaging prompts for Stable Diffusion or DALL·E. 
Avoid repetition or vague words. Don't refer to tweet or caption directly. Keep it tech-oriented and visually rich. 
Limit to 60 words. Always end with: "The image must be 1:1 in aspect ratio."`,
    },
  });

  return response.text;
}

module.exports = generateImagePrompt;
