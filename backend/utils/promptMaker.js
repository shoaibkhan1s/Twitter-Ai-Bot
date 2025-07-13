require('dotenv').config({ path: __dirname + '/../.env', override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImagePrompt(caption) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a realistic visual scene for this caption: "${caption}".
It should show a human doing something related to the caption in a relatable environment (desk, cafe, office, home).

Guidelines:
- No surreal, cyberpunk, or fantasy styles.
- Use natural/soft light, realistic body proportions.
- End with: "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. please do not add watermark."`,
      
      config: {
        systemInstruction: `
You are a prompt engineer creating realistic image prompts for a caption.
– Make the scene look natural.
– Avoid glitchy, sci-fi, cyberpunk or surreal elements.
– Clearly describe lighting, setting, and action.
– End with "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. please do not add watermark.
- Please create prompt only for men`,

      },
    });

    return response.text;
  } catch (error) {
    console.error("❌ Error generating image prompt:", error);
    throw error;
  }
}

module.exports = generateImagePrompt;
