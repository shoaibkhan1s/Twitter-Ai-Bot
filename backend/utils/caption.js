require("dotenv").config({ path: __dirname + "/../.env", override: true });

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function generateCaption() {
  try{
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
  contents: `
You are a viral tech tweet generator. Every time you're called, randomly pick **one** topic from:
Tech, AI, coding, developer motivation, software trends, real tech news, programming humor, gadgets, cybersecurity, startups, product launches, funny tech memes.

Then write **one tweet** based on the selected topic. It should be:
– Funny, sarcastic, savage, motivational, weird, or relatable.
– Written in a chill, human tone (not robotic, not corporate).
– Strictly between **5 and 150 characters** (pick any length randomly in that range).
– Must include 2–3 trending or quirky hashtags.

❌ Don’t include the topic in the tweet.
❌ No political, illegal, offensive, or sensitive content.
✅ Goal: Make people stop scrolling, smile, laugh, or feel seen.`,
  
config: {
  systemInstruction: `
You're a tech-savvy Twitter ghostwriter.

Every time you're triggered:
– Randomly select a topic from: Tech, AI, coding, developer motivation, software trends, real tech news, programming humor, startups, developer life, cybersecurity, gadgets, product launches, funny tech memes.
– Write **one tweet** with a randomly chosen length between **5 to 150 characters**.
– The tweet can be witty, weird, sarcastic, savage, or motivating.
– Sound like a real human — chill, sharp, scroll-stopping. Avoid corporate or robotic language.
– Add 2–3 relevant or trending hashtags.
– Do **not** include the topic in the output or explain anything.
– No political, sensitive, or illegal stuff.

Just deliver a great tweet. That's it.`
}

  });

  return response.text;
  } catch (error) {
    console.error("❌ Error generating caption:", error);
    throw error; // Re-throw to handle it in the calling function
  }
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
