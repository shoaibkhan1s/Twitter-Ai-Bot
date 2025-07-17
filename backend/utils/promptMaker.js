require("dotenv").config({ path: __dirname + "/../.env", override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImagePrompt(caption, gender = "neutral", interest = "tech") {
  try {
    // Validate inputs
    if (!caption || typeof caption !== "string" || caption.trim() === "") {
      throw new Error("Caption is required and must be a non-empty string.");
    }
    if (!["male", "female", "neutral"].includes(gender.toLowerCase())) {
      throw new Error("Gender must be 'male', 'female', or 'neutral'.");
    }
    if (!interest || typeof interest !== "string") {
      throw new Error("Interest is required and must be a string.");
    }

    // Dynamically decide the scene based on interest
    let setting;
    switch (interest.toLowerCase()) {
      case "tech":
      case "devlife":
      case "productivity":
        setting = "at a collaborative workspace with laptops and whiteboards";
        break;
      case "food":
        setting = "in a cozy cafe or trendy restaurant with a lively atmosphere";
        break;
      case "fitness":
      case "gym":
        setting = "in a modern gym with people working out together";
        break;
      case "travel":
        setting = "in a scenic outdoor location like mountains, beaches, or a bustling city street with travelers";
        break;
      case "fashion":
        setting = "in a stylish urban street or fashion studio with a group of trendsetters";
        break;
      case "music":
        setting = "in a music studio or a small stage with musicians performing";
        break;
      case "funny":
      case "memes":
        setting = "in a humorous group setting like a couch, elevator, store, or random public place";
        break;
      case "health":
        setting = "in a calm kitchen, yoga studio, or nature background with wellness enthusiasts";
        break;
      case "art":
        setting = "in a vibrant art studio or outdoor sketching area with artists collaborating";
        break;
      default:
        setting = "in a relatable group setting like a living room, street, or cafe";
    }

    // Determine number of people based on use case
    let people;
    const groupInterests = ["tech", "devlife", "food", "fitness", "gym", "travel", "fashion", "music", "funny", "memes", "art"];
    const isGroupSetting = groupInterests.includes(interest.toLowerCase());

    if (isGroupSetting) {
      people = gender === "male" ? "a group of young men" :
               gender === "female" ? "a group of young women" :
               "a diverse group of people";
    } else {
      people = gender === "male" ? "a young man" :
               gender === "female" ? "a young woman" :
               "a person";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a realistic image scene for this caption:

"${caption}"

Requirements:
– Show ${people} ${setting}.
– The body language and expression must reflect the emotion of the caption.
– Use soft, natural light or indoor lighting appropriate to the setting.
– Keep the proportions realistic and detailed.
– Avoid cartoonish, surreal, cyberpunk, fantasy, glitchy, or abstract styles.
– Ensure the prompt includes ${setting} to maintain context.
End with:
"The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. Please do not add watermark."`,
      config: {
        systemInstruction: `
You're an expert prompt engineer for AI image generation.
Design prompts that describe realistic scenes matching user emotion and topic.
Ensure:
– The environment is situation-based (e.g., tech = collaborative workspace, food = lively restaurant, gym = active workout scene).
– Lighting and proportions are natural and realistic.
– Gender: ${gender}, with dynamic group sizes (single person or group based on interest).
– Include appropriate body language and expressions to reflect the caption's emotion.
– Final line must be: "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. Please do not add watermark."`,
      },
    });

    // Validate response
    if (!response.text || typeof response.text !== "string") {
      throw new Error("Invalid response from AI model: No text generated.");
    }

    return response.text;
  } catch (error) {
    console.error("❌ Error generating image prompt:", error.message);
    throw new Error(`Failed to generate image prompt: ${error.message}`);
  }
}

module.exports = generateImagePrompt;