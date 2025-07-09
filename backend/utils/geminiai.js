require('dotenv').config({ path: __dirname + '/../.env', override: true });

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function generateCaption() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Give me only 1 short, viral, may or may not be funny tone, (tech-related or tech news related) tweet about AI or software trends. Under 150 characters. Make it witty. also add 2-3 hashtags please does not use fancy writing, just write like a normal person. please remember tweet must be make sense, please also remember you could not generate any illegal tweet or any sensitive tweet",
    config: {
      systemInstruction: "Act like a savage tech-savvy Twitter ghostwriter who knows how to write funny, sarcastic, and viral one-liners about coding, AI, startups, and tech life—all under 150 characters. Include 2–3 trending or quirky hashtags. Keep it weird. Keep it real. Make people scroll, stop, laugh, and retweet.",
    },
  });

  return response.text;
}

async function keywordForPexel(caption) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate only 2-3 keywords for Pexels from the following caption please remember that the keyword must be matched to the caption so that i can extract related images of caption from pexels: "${caption}"`,
    config: {
      systemInstruction: "Extract relevant keywords for Pexels from the given caption. you are the best keyword extractor for Pexels, you only need to return 2-3 keywords that are relevant to the caption.",
    },
  });

  return response.text;
}

// 🔥 This immediately resolves both values so you can use or export them
const captionPromise = generateCaption();
const generatedKeywordPromise = captionPromise.then(caption => keywordForPexel(caption));

// Optional logging (you can comment this out if you're using elsewhere)
captionPromise.then(caption => console.log("Caption:", caption));
generatedKeywordPromise.then(keywords => console.log("Generated Keywords for Pexels:", keywords));

// 🧠 Export the functions and resolved promises
module.exports = {
  generateCaption,
  keywordForPexel,
  caption: captionPromise,
  generatedKeyword: generatedKeywordPromise,
};
