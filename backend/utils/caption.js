require("dotenv").config({ path: __dirname + "/../.env", override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateCaption(
  interest,
  captionType="motivational",
  language ,
  targetAudience = "general",
  captionLength = "medium",
  mood = "happy",
  emojiIntensity = "minimal"
) {
  try {
    const requiredParams = {
      interest,
      captionType,
      language,
      targetAudience,
      captionLength,
      mood,
      emojiIntensity,
    };
       
    for (const [key, value] of Object.entries(requiredParams)) {
      if (value === undefined || value === null) {
        throw new Error(`Missing or invalid parameter: ${key}`);
      }
    }
    // Define character limits based on captionLength
    const lengthLimits = {
      "very-short": { min: 5, max: 30 },
      short: { min: 30, max: 80 },
      medium: { min: 80, max: 150 },
      long: { min: 150, max: 220 },
      max: { min: 220, max: 280 },
    };

    const { min, max } = lengthLimits[captionLength] || lengthLimits.medium;

    // Define emoji count based on emojiIntensity
    const emojiCounts = {
      none: 0,
      minimal: 1,
      moderate: 2,
      heavy: 3,
    };

    const emojiCount = emojiCounts[emojiIntensity] || 1;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a viral tweet ghostwriter who crafts authentic, human-like tweets that feel like they were written by a trendy, witty social media influencer.

Write 1 viral tweet with the following requirements:
- Topic: Related to "${interest}" but do NOT explicitly mention the topic name.
- Tone: "${captionType}" (e.g., funny, sarcastic, motivational, poetic, etc.).
- Language: "The tweet must be in  ${language} language".
- Target Audience: "${targetAudience}" (e.g., teenagers, professionals, students, etc.).
- Mood: "${mood}" (e.g., happy, sarcastic, nostalgic, etc.).
- Length: Between ${min} and ${max} characters (strictly adhere to this range).
- Emojis: Include exactly ${emojiCount} emoji(s) to match "${emojiIntensity}" intensity. Choose emojis that are trendy and relevant to the mood and audience.
-Don't forget to add 2-3 trending hashtags of given topic.
- Style: Human, relatable, and platform-native (like something a Twitter user would naturally post).
- Avoid:  sensitive/political/NSFW content, or anything controversial.
- Output: ONLY the tweet text (no explanations, no extra text).`,
      config: {
        systemInstruction: `You are an expert at crafting viral, human-like tweets that resonate with the target audience. Your tweets should feel organic, witty, and tailored to the specified tone, mood, and audience. Use natural language patterns, slang, or cultural references relevant to "${language}" and "${targetAudience}". Strictly adhere to the character length (${min}-${max}) and include exactly ${emojiCount} emoji(s). Avoid hashtags, controversial topics, or anything that feels robotic or AI-generated. Output ONLY the tweet text.`,
      },
    });
console.log(captionType,language)
    return response.text;
  } catch (error) {
    console.error("❌ Error generating caption:", error);
    throw error;
  }
}

module.exports = {
  generateCaption,
};

// require("dotenv").config({ path: __dirname + "/../.env", override: true });
// const { GoogleGenAI } = require("@google/genai");
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// async function generateCaption({
//   interest,
//   captionType,
//   language = "english",
//   targetAudience = "general",
//   captionLength = "medium",
//   mood = "happy",
//   emojiIntensity = "minimal",
// }) {
//   try {
//     console.log("📥 generateCaption parameters:", JSON.stringify({
//       interest,
//      captionType,
//       language,
//       targetAudience,
//       captionLength,
//       mood,
//       emojiIntensity,
//     }, null, 2));

//     // Validate input parameters
//     const requiredParams = { interest,captionType, language, targetAudience, captionLength, mood, emojiIntensity };
//     for (const [key, value] of Object.entries(requiredParams)) {
//       if (value === undefined || value === null) {
//         throw new Error(`Missing or invalid parameter: ${key}`);
//       }
//     }
//     // Define character limits based on captionLength
//     const lengthLimits = {
//       "very-short": { min: 5, max: 30 },
//       short: { min: 30, max: 80 },
//       medium: { min: 80, max: 150 },
//       long: { min: 150, max: 220 },
//       max: { min: 220, max: 280 },
//     };

//     const { min, max } = lengthLimits[captionLength] || lengthLimits.medium;

//     // Define emoji count based on emojiIntensity
//     const emojiCounts = {
//       none: 0,
//       minimal: 1,
//       moderate: 2,
//       heavy: 3,
//     };

//     const emojiCount = emojiCounts[emojiIntensity] || 1;

// //     // Construct the prompt
//     const prompt = `
// You are a viral tweet ghostwriter who crafts authentic, human-like tweets that feel like they were written by a trendy, witty social media influencer.

// Write 1 viral tweet with the following requirements:
// - Topic: Related to "${interest}" but do NOT explicitly mention the topic name.
// - Tone: "${captionType}" (e.g., funny, sarcastic, motivational, poetic, etc.).
// - Language: "${language}" (e.g., English, Hindi, Hinglish, etc.).
// - Target Audience: "${targetAudience}" (e.g., teenagers, professionals, students, etc.).
// - Mood: "${mood}" (e.g., happy, sarcastic, nostalgic, etc.).
// - Length: Between ${min} and ${max} characters (strictly adhere to this range).
// - Emojis: Include exactly ${emojiCount} emoji(s) to match "${emojiIntensity}" intensity. Choose emojis that are trendy and relevant to the mood and audience.
// - Style: Human, relatable, and platform-native (like something a Twitter user would naturally post).
// - Avoid: Hashtags, sensitive/political/NSFW content, or anything controversial.
// - Output: ONLY the tweet text (no explanations, no extra text).`;

//  //   System instruction for better control

//     const systemInstruction = `
// You are an expert at crafting viral, human-like tweets that resonate with the target audience. Your tweets should feel organic, witty, and tailored to the specified tone, mood, and audience. Use natural language patterns, slang, or cultural references relevant to "${language}" and "${targetAudience}". Strictly adhere to the character length (${min}-${max}) and include exactly ${emojiCount} emoji(s). Avoid hashtags, controversial topics, or anything that feels robotic or AI-generated. Output ONLY the tweet text.`;

//    // Generate the caption
//     const response = await ai.models.generateContent({
// model: "gemini-2.5-flash",
//       contents: [{ role: "user", content: prompt }],
//      config: {
//       systemInstruction
//      }
//     });

//     let caption = response.response.text.trim();

//     return caption;
//   } catch (error) {
//     console.error("❌ Error generating caption:", {
//       message: error.message,
//       interest,
//      captionType,
//       language,
//       targetAudience,
//       captionLength,
//       mood,
//       emojiIntensity,
//     });
//     throw new Error(`Failed to generate caption: ${error.message}`);
//   }
// }

// module.exports = {
//   generateCaption,
// };

// require("dotenv").config({ path: __dirname + "/../.env", override: true });
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Initialize Gemini API
// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

// async function generateCaption({
//   interest,
//   tone = "funny",
//   language = "english",
//   targetAudience = "general",
//   captionLength = "medium",
//   mood = "happy",
//   emojiIntensity = "minimal",
// }) {
//   try {
//     // Debug log for incoming parameters
//     console.log("📥 generateCaption parameters:", JSON.stringify({
//       interest,
//       tone,
//       language,
//       targetAudience,
//       captionLength,
//       mood,
//       emojiIntensity,
//     }, null, 2));

//     // Validate input parameters
//     const requiredParams = { interest, tone, language, targetAudience, captionLength, mood, emojiIntensity };
//     for (const [key, value] of Object.entries(requiredParams)) {
//       if (value === undefined || value === null) {
//         throw new Error(`Missing or invalid parameter: ${key}`);
//       }
//     }

//     // Define character limits and token estimates
//     const lengthLimits = {
//       "very-short": { min: 5, max: 30, tokenEstimate: 10 },
//       short: { min: 30, max: 80, tokenEstimate: 20 },
//       medium: { min: 80, max: 150, tokenEstimate: 40 },
//       long: { min: 150, max: 220, tokenEstimate: 60 },
//       max: { min: 220, max: 280, tokenEstimate: 80 },
//     };

//     const { min, max, tokenEstimate } = lengthLimits[captionLength] || lengthLimits.medium;

//     // Define emoji count
//     const emojiCounts = {
//       none: 0,
//       minimal: 1,
//       moderate: 2,
//       heavy: 3,
//     };

//     const emojiCount = emojiCounts[emojiIntensity] || 1;

//     // Construct the prompt
//     const prompt = `
// You are a viral tweet ghostwriter, crafting authentic, human-like tweets that feel like they were written by a trendy, witty Twitter/X influencer.

// Write 1 viral tweet with the following requirements:
// - Topic: Subtly inspired by "${interest}" (DO NOT mention the topic name explicitly).
// - Tone: "${tone}" (e.g., funny, sarcastic, motivational, poetic, minimalist, etc.).
// - Language: "${language}" (use natural, conversational style with trendy slang, e.g., 'jhakas' for Hinglish, colloquial for Urdu).
// - Target Audience: "${targetAudience}" (tailor the vibe to resonate with this group, e.g., Gen-Z slang for teenagers, polished for professionals).
// - Mood: "${mood}" (e.g., happy, sarcastic, nostalgic, confident, etc.).
// - Length: Strictly between ${min} and ${max} characters (aim for a natural fit).
// - Emojis: Include exactly ${emojiCount} trendy, relevant emoji(s) that enhance the mood and audience appeal.
// - Style: Organic, platform-native, and human-like. Use conversational patterns, humor, or cultural references.
// - Avoid: Hashtags, sensitive/political/NSFW content, or anything controversial.
// - Output: ONLY the tweet text (no explanations, no extra text).`;

//     // System instruction
//     const systemInstruction = `
// You are a master at crafting viral, human-like tweets that resonate with "${targetAudience}" on Twitter/X. Use natural, conversational language with trendy slang specific to "${language}". Match the "${tone}" tone and "${mood}" mood exactly. Include precisely ${emojiCount} emoji(s). Keep the tweet strictly between ${min} and ${max} characters. Avoid hashtags, controversial topics, or robotic/AI-generated vibes. Output ONLY the tweet text.`;

//     // Generate the caption
//     let caption = "";
//     let attempts = 0;
//     const maxAttempts = 3;

//     while (attempts < maxAttempts) {
//       const response = await ai.models.generateContent({
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         systemInstruction,
//         generationConfig: {
//           maxOutputTokens: tokenEstimate,
//           temperature: 0.95,
//           topP: 0.9,
//           topK: 50,
//         },
//       });

//       // Debug log for raw API response
//       console.log("📬 Gemini API raw response:", JSON.stringify(response, null, 2));

//       // Check if response has valid content
//       if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
//         throw new Error("Invalid or empty response from Gemini API");
//       }

//       caption = response.candidates[0].content.parts[0].text.trim();

//       if (caption.length >= min && caption.length <= max) {
//         break;
//       }

//       console.warn(`⚠️ Caption length (${caption.length}) outside range (${min}-${max}). Retrying...`);
//       prompt += `\n\nPrevious output was ${caption.length} characters. Adjust to strictly fit between ${min} and ${max} characters.`;
//       attempts++;
//     }

//     // Fallback if length is still off
//     if (caption.length < min || caption.length > max) {
//       console.warn(`⚠️ Caption length (${caption.length}) outside range (${min}-${max}) after ${maxAttempts} attempts. Using fallback.`);
//       caption = language === "urdu" ? `صحت مند زندگی جیو! 😊` : `Stay healthy, live happy! 😊`;
//       if (caption.length > max) {
//         caption = caption.slice(0, max);
//       }
//     }

//     // Validate emoji count
//     const emojiRegex = /[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}]/gu;
//     const currentEmojiCount = (caption.match(emojiRegex) || []).length;
//     if (currentEmojiCount !== emojiCount) {
//       console.warn(`⚠️ Emoji count mismatch: expected ${emojiCount}, got ${currentEmojiCount}`);
//     }

//     // Debug log for final caption
//     console.log("📝 Generated caption:", caption);

//     return caption;
//   } catch (error) {
//     const errorDetails = {
//       error: error.message,
//       parameters: { interest, tone, language, targetAudience, captionLength, mood, emojiIntensity },
//       timestamp: new Date().toISOString(),
//       context: "Caption generation failed",
//     };
//     console.error("❌ Error generating caption:", JSON.stringify(errorDetails, null, 2));

//     // Fallback caption
//     const fallbackCaption = language === "urdu" ? `صحت مند زندگی جیو! 😊` : `Stay healthy, live happy! 😊`;
//     const { max } = lengthLimits[captionLength] || lengthLimits.medium;
//     return fallbackCaption.length <= max ? fallbackCaption : fallbackCaption.slice(0, max);
//   }
// }

// module.exports = {
//   generateCaption,
// };
