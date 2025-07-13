require("dotenv").config({ path: __dirname + "/../.env", override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImagePrompt(caption, gender = "neutral", interest = "tech") {
  try {
    let setting = "";

    // Dynamically decide the scene based on interest
    switch (interest.toLowerCase()) {
      case "tech":
      case "devlife":
      case "productivity":
        setting = "at a desk with a laptop or computer";
        break;
      case "food":
        setting = "in a cozy cafe or trendy restaurant";
        break;
      case "fitness":
      case "gym":
        setting = "in a well-lit modern gym";
        break;
      case "travel":
        setting = "in a scenic outdoor location like mountains, beaches, or a bustling city street";
        break;
      case "fashion":
        setting = "in a stylish urban street or fashion studio";
        break;
      case "music":
        setting = "in a studio or a small stage with soft lights";
        break;
      case "funny":
      case "memes":
        setting = "in an everyday funny moment setting — couch, elevator, store, or random public place";
        break;
      case "health":
        setting = "in a calm kitchen, yoga studio, or nature background";
        break;
      case "art":
        setting = "in a vibrant studio or outdoor sketching area";
        break;
      default:
        setting = "in a relatable setting like a bedroom, living room, street, or cafe";
    }

    const person =
      gender === "male"
        ? "a young man"
        : gender === "female"
        ? "a young woman"
        : "a person";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a realistic image scene for this caption:

"${caption}"

Requirements:
– Show ${person} ${setting}.
– The body language and expression must reflect the emotion of the caption.
– Use soft, natural light or indoor lighting.
– Keep the proportions realistic.
– Avoid cartoonish, surreal, cyberpunk, fantasy, glitchy, or abstract styles.
-Please remember prompt must contains ${setting}.
End with:
"The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. please do not add watermark."`,
      config: {
        systemInstruction: `
You're an expert prompt engineer for AI image generation.
Design prompts that describe realistic scenes matching user emotion and topic.
Ensure:
– The environment is situation-based (tech = laptop, food = restaurant, gym = weights).
– Lighting and proportions are natural.
– Gender: ${gender}
– Add emotion, action, and realistic setting.
– Final line must be: "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. please do not add watermark."`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("❌ Error generating image prompt:", error);
    throw error;
  }
}

module.exports = generateImagePrompt;
