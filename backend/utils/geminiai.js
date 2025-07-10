require("dotenv").config({ path: __dirname + "/../.env", override: true });

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function generateCaption() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "You are a viral tech tweet generator. Randomly pick one topic from this list: Tech, AI, software trends, real tech news, programming humor, gadgets, cybersecurity, startups, developer life, product launches, funny tech memes.Then, based on the chosen topic, write only one short, witty, viral tweet (under 150 characters).Your tone should be fun, sarcastic, clever, or relatable—but like a normal person tweets, not a corporate bot.Don’t use fancy or flowery writing.Always add 2-3 relevant, trending hashtags.Avoid any illegal, political, or sensitive content.Just be chill, smart, and scroll-stopping.Please don't write topic just generate caption based on the topic you picked.",
    config: {
      systemInstruction:
        "You are a savage, tech-savvy Twitter ghostwriter.Every time you're called, randomly pick a topic from:Tech, AI, coding, startups, real tech news, programming humor, developer life, product launches, gadgets, cybersecurity, funny tech memes.Based on the selected topic, generate one short tweet (under 150 characters) that is funny, sarcastic, savage, weird, or witty.Always include 2–3 trending or quirky hashtags.Write like a real human, not a bot—keep it casual, relatable, and scroll-stopping.Avoid fancy language, corporate tone, or robotic replies.Never generate illegal, political, sensitive, or offensive content.Your goal: make people stop, laugh, and share.",
    },
  });

  return response.text;
}

// 🔥 This immediately resolves both values so you can use or export them
const captionPromise = generateCaption();

// Optional logging (you can comment this out if you're using elsewhere)
captionPromise.then((caption) => console.log("Caption:", caption));

// 🧠 Export the functions and resolved promises
module.exports = {
  generateCaption,
  caption: captionPromise,
};
