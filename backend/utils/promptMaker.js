require('dotenv').config({ path: __dirname + '/../.env', override: true });
const captionPromise = require('./geminiai').caption;
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImagePrompt(captionPromise) {
    const caption = await captionPromise;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a detailed image generation prompt for Stable Diffusion based on this tweet: "${caption}". 
The prompt should describe the scene vividly, including setting, lighting, mood, background, art style, and visual composition. 
Make sure the image would look interesting, futuristic, or tech-themed. Do not include the original text, just describe the image.`,
    config: {
      systemInstruction: `You're a professional prompt engineer who converts tech-related tweet captions into highly detailed, vivid, and realistic image generation prompts for models like Stable Diffusion or DALL·E. 
Avoid generic or repetitive descriptions. Your prompts must be unique, engaging, and relevant to the given caption. Do not use the words "caption" or "tweet". Just return the visual prompt.`,
    },
  });

  return response.text;
}

generateImagePrompt(captionPromise)
  .then(prompt => console.log("Generated Image Prompt:", prompt))
  .catch(err => console.error("Error generating image prompt:", err));

module.exports = generateImagePrompt;
