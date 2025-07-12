require('dotenv').config({ path: __dirname + '/../.env', override: true });
const captionPromise = require('./caption').caption;
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImagePrompt() {
  try {
    const caption = await captionPromise;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
   contents: `
Create a highly realistic scene based on this caption: "${caption}". 
Show a real human (not cartoonish) in a relatable tech environment — like working on a laptop, fixing a bug, reacting to code error, or browsing tech news. 
Scene could be indoors (home, desk setup, office) or public (cafe, coworking space). 
Use natural or soft lighting. Avoid surreal, sci-fi, fantasy, glitchy, or stylized effects. 
No extra limbs, distortions, or futuristic overlays.

Keep the description concise and under 60 words.

End with: "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects."`,
  
config: {
  systemInstruction: `
You're a prompt engineer optimizing for Pollinations AI. Your task is to generate **natural, clean, realistic** prompts from short tweet captions.

Every prompt must:
– Focus on realistic humans doing tech-related activities.
– Avoid abstract, cyberpunk, glitchy, or fantasy-style visuals.
– Include clear background and lighting context (day/night, indoor/outdoor).
– Avoid overly poetic or vague words like “ethereal,” “futuristic haze,” or “matrix aura.”
– Prevent image errors like extra limbs or weird faces.
– End every prompt with: "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects.
- add this line : please do not add watermark."`
}

  });

  return response.text;
  } catch (error) { 
    console.error("❌ Error generating image prompt:", error);
    throw error; // Re-throw to handle it in the calling function
  }
}
generateImagePrompt().then(prompt => console.log(prompt)).catch(console.error);

module.exports = generateImagePrompt;
