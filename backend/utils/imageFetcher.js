require('dotenv').config({ path: __dirname + '/../.env', override: true });
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
const generateImagePrompt = require('./promptMaker'); // Import the prompt generator
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImageFromPrompt(imagePrompt) {
  const prompt = await imagePrompt
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Generate a high-quality AI image from the following visual prompt. 
Do not add any text, labels, or watermark. Focus on photorealism or digital art, depending on the theme:\n\n"${prompt}"`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: `You are an expert visual content creator.
Take detailed image prompts and generate a realistic visual in PNG format.
Only return image parts, no text or explanation.`,
    },
  });

  const imagePart = response.response.parts?.find(
    (part) => part.inlineData && part.inlineData.mimeType?.startsWith('image/')
  );

  if (!imagePart) {
    throw new Error('❌ No image part returned from Gemini');
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const filename = 'output.png';
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Image saved as ${filename}`);
  return filename;
}
generateImageFromPrompt(generateImagePrompt()).then((filename) => {
  console.log(`Image generated and saved as ${filename}`);
}).catch((err) => {
  console.error('❌ Error generating image:', err);
});

module.exports = generateImageFromPrompt;
