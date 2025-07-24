import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners";
import { Outlet, Link } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function App() {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [interest, setInterest] = useState("tech");
  const [captionType, setCaptionType] = useState("motivational");
  const [gender, setGender] = useState("male");
  const [language, setLanguage] = useState("english");
  const [targetAudience, setTargetAudience] = useState("general");
  const [captionLength, setCaptionLength] = useState("medium");
  const [mood, setMood] = useState("happy");
  const [emojiIntensity, setEmojiIntensity] = useState("minimal");
  const [msg, setMsg] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [captionSuccess, setCaptionSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAnyBtnClick, setIsAnyBtnClick] = useState(false);
  const [isPostBtnClick, setIsPostBtnClick] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/twitter/session`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        setToken(res.data.token);
        setSecret(res.data.secret);
      } catch (err) {
        console.log("🔒 No active session.");
      }
    };
    fetchSession();
  }, []);

  const handlePostCaption = async () => {
    setLoading3(true);
    setCaptionSuccess(false);
    setIsAnyBtnClick(true);
    setIsPostBtnClick(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/tweet/caption`,
        {
          token,
          secret,
          msg,
        }
      );
      setCaptionSuccess(true);
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setLoading3(false);
    setIsAnyBtnClick(false);
  };

  const handlePost = async () => {
    setLoading1(true);
    setPostSuccess(false);
    setIsAnyBtnClick(true);
    setIsPostBtnClick(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/tweet/post`,
        {
          token,
          secret,
          msg,
          filename,
        },
        { withCredentials: true }
      );
      setPostSuccess(true);
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setLoading1(false);
    setIsAnyBtnClick(false);
  };

  const generatePost = async () => {
    setLoading2(true);
    setIsAnyBtnClick(true);
    setMsg("");
    setIsPostBtnClick(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/tweet`, {
        token,
        secret,
        interest,
        captionType,
        gender,
        language,
        targetAudience,
        captionLength,
        mood,
        emojiIntensity,
      });
      setImage(res.data.image || null);
      setMsg(res.data.caption || "Tweet posted!");
      setFilename(res.data.filename || "");
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setLoading2(false);
    setIsAnyBtnClick(false);
    setCaptionSuccess(false);
    setPostSuccess(false);
  };

  const logout = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/twitter/logout`;
  };

  const interests = [
    "Tech", "Funny", "Finance", "Memes", "Motivation", "DevLife", "Gaming",
    "Cyber Security", "Health", "Education", "Fitness", "Travel", "Food",
    "Fashion", "Music", "Art", "Sports", "News", "Lifestyle", "AI", "Startups",
    "Productivity", "Emotional Growth", "Spirituality", "Business", "Marketing", "Books",
    "Cryptocurrency", "Web3", "Blockchain", "Sustainability", "Mental Health",
    "Parenting", "Relationships", "Photography", "Movies", "TV Shows", "Anime",
    "Entrepreneurship", "Career Advice", "Self Improvement", "Science", "History",
    "DIY Projects", "Pets", "Adventure", "Pop Culture", "Gadgets", "Space Exploration",
    "Social Media", "Fitness Challenges"
  ];

  const captionStyles = [
    { value: "motivational", label: "Motivational Speaker" },
    { value: "funny", label: "Funny Tone" },
    { value: "savage", label: "Savage" },
    { value: "weird", label: "Weirdly Cool" },
    { value: "chill", label: "Chill & Relatable" },
    { value: "meme-lord", label: "Meme-Lord" },
    { value: "professor-vibes", label: "Professor Vibes" },
    { value: "soft-aesthetic", label: "Soft Aesthetic" },
    { value: "future-forward", label: "Future-Forward" },
    { value: "hustle-culture", label: "Hustle Culture" },
    { value: "minimalist", label: "Minimalist" },
    { value: "ceo-grindset", label: "CEO Grindset" },
    { value: "growth-guru", label: "Growth Guru" },
    { value: "page-turner", label: "Page-Turner" },
    { value: "poetic", label: "Poetic & Lyrical" },
    { value: "nerdy", label: "Nerdy & Geeky" },
    { value: "retro", label: "Retro Vibes" },
    { value: "edgy", label: "Edgy & Bold" },
    { value: "wholesome", label: "Wholesome & Heartfelt" },
    { value: "sarcastic", label: "Sarcastic & Witty" },
    { value: "dreamy", label: "Dreamy & Imaginative" },
    { value: "professional", label: "Professional & Polished" },
    { value: "youthful", label: "Youthful & Energetic" },
    { value: "mystical", label: "Mystical & Spiritual" },
    { value: "epic", label: "Epic & Cinematic" }
  ];

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "neutral", label: "Gender Neutral" },
    { value: "non-binary", label: "Non-Binary" },
    { value: "inclusive", label: "Inclusive (No Pronouns)" },
    { value: "male-leaning", label: "Male-Leaning" },
    { value: "female-leaning", label: "Female-Leaning" }
  ];

  const languages = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "spanish", label: "Spanish" },
    { value: "hinglish", label: "Hinglish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese (Mandarin)" },
    { value: "punjabi", label: "Punjabi" },
    { value: "japanese", label: "Japanese" },
    { value: "russian", label: "Russian" },
    { value: "arabic", label: "Arabic" },
    { value: "portuguese", label: "Portuguese" },
    { value: "italian", label: "Italian" },
    { value: "bengali", label: "Bengali" },
    { value: "urdu", label: "Urdu" },
    { value: "turkish", label: "Turkish" },
    { value: "korean", label: "Korean" },
    { value: "persian", label: "Persian" },
    { value: "swahili", label: "Swahili" },
    { value: "dutch", label: "Dutch" },
    { value: "greek", label: "Greek" },
    { value: "thai", label: "Thai" },
    { value: "polish", label: "Polish" },
    { value: "romanian", label: "Romanian" },
    { value: "hungarian", label: "Hungarian" },
    { value: "czech", label: "Czech" },
    { value: "hebrew", label: "Hebrew" },
    { value: "indonesian", label: "Indonesian" },
    { value: "malay", label: "Malay" },
    { value: "vietnamese", label: "Vietnamese" },
    { value: "filipino", label: "Filipino" },
    { value: "swedish", label: "Swedish" },
    { value: "tamil", label: "Tamil" },
    { value: "telugu", label: "Telugu" },
    { value: "marathi", label: "Marathi" },
    { value: "gujarati", label: "Gujarati" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
    { value: "odia", label: "Odia" },
    { value: "assamese", label: "Assamese" },
    { value: "sindhi", label: "Sindhi" },
    { value: "nepali", label: "Nepali" },
    { value: "sinhala", label: "Sinhala" },
    { value: "finnish", label: "Finnish" },
    { value: "norwegian", label: "Norwegian" },
    { value: "danish", label: "Danish" },
    { value: "ukrainian", label: "Ukrainian" },
    { value: "bhojpuri", label: "Bhojpuri" },
    { value: "maithili", label: "Maithili" },
    { value: "sanskrit", label: "Sanskrit" }
  ];

  const targetAudiences = [
    { value: "general", label: "General" },
    { value: "teenagers", label: "Teenagers" },
    { value: "professionals", label: "Professionals" },
    { value: "students", label: "Students" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "parents", label: "Parents" },
    { value: "gamers", label: "Gamers" },
    { value: "fitness-enthusiasts", label: "Fitness Enthusiasts" },
    { value: "techies", label: "Tech Enthusiasts" },
    { value: "creatives", label: "Creatives (Artists/Designers)" },
    { value: "foodies", label: "Foodies" },
    { value: "travelers", label: "Travelers" },
    { value: "investors", label: "Investors" },
    { value: "students-college", label: "College Students" },
    { value: "job-seekers", label: "Job Seekers" },
    { value: "freelancers", label: "Freelancers" },
    { value: "small-business-owners", label: "Small Business Owners" },
    { value: "content-creators", label: "Content Creators" },
    { value: "activists", label: "Social Activists" },
    { value: "seniors", label: "Seniors" }
  ];

  const captionLengths = [
    { value: "very-short", label: "Very Short (<30 chars)" },
    { value: "short", label: "Short (30-80 chars)" },
    { value: "medium", label: "Medium (80-150 chars)" },
    { value: "long", label: "Long (150-220 chars)" },
    { value: "max", label: "Max (220-280 chars)" }
  ];

  const moods = [
    { value: "happy", label: "Happy" },
    { value: "inspirational", label: "Inspirational" },
    { value: "sarcastic", label: "Sarcastic" },
    { value: "nostalgic", label: "Nostalgic" },
    { value: "curious", label: "Curious" },
    { value: "excited", label: "Excited" },
    { value: "calm", label: "Calm" },
    { value: "angry", label: "Angry" },
    { value: "hopeful", label: "Hopeful" },
    { value: "playful", label: "Playful" },
    { value: "serious", label: "Serious" },
    { value: "romantic", label: "Romantic" },
    { value: "confident", label: "Confident" },
    { value: "mysterious", label: "Mysterious" },
    { value: "grateful", label: "Grateful" }
  ];

  const emojiIntensities = [
    { value: "none", label: "No Emojis" },
    { value: "minimal", label: "Minimal Emojis" },
    { value: "moderate", label: "Moderate Emojis" },
    { value: "heavy", label: "Heavy Emojis" }
  ];

  if (!token || !secret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md p-10 rounded-2xl border border-[#3fefef] shadow-[0_0_25px_#3fefef80] max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold mb-6 text-[#3fefef]">
            🚀 Twitter Auto Poster
          </h1>
          <a
            href={`${import.meta.env.VITE_BASE_URL}/auth/twitter/login`}
            className="bg-black border border-[#3fefef] hover:shadow-[0_0_20px_#3fefefaa] text-[#3fefef] px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Login with Twitter
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md p-10 rounded-2xl border border-[#3fefef] shadow-[0_0_25px_#3fefef80] max-w-lg mx-auto"
      >
        {user?.photos?.[0]?.value && (
          <img
            src={user.photos[0].value}
            alt="User avatar"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#3fefef] animate-pulse">
          Welcome, {user ? user.displayName : "User"}! 🚀
        </h1>

        <div className="space-y-6">
          {/* Interest */}
          <div>
            <label className="block text-[#3fefef] mb-2">🎯 Select Interest</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              {interests.map((option) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Caption Style */}
          <div>
            <label className="block text-[#3fefef] mb-2">🎤 Caption Style</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={captionType}
              onChange={(e) => setCaptionType(e.target.value)}
            >
              {captionStyles.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[#3fefef] mb-2">👤 Select Gender</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {genders.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[#3fefef] mb-2">🌐 Language for Caption</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-[#3fefef] mb-2">🎯 Target Audience</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              {targetAudiences.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Caption Length */}
          <div>
            <label className="block text-[#3fefef] mb-2">📏 Caption Length</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={captionLength}
              onChange={(e) => setCaptionLength(e.target.value)}
            >
              {captionLengths.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-[#3fefef] mb-2">😊 Caption Mood</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              {moods.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Emoji Intensity */}
          <div>
            <label className="block text-[#3fefef] mb-2">😎 Emoji Intensity</label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={emojiIntensity}
              onChange={(e) => setEmojiIntensity(e.target.value)}
            >
              {emojiIntensities.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Post Button */}
          <motion.button
            whileHover={{ scale: 1.09, boxShadow: "0 0 40px #00f6ffcc" }}
            whileTap={{ scale: 0.97 }}
            onClick={generatePost}
            disabled={loading2 || isAnyBtnClick}
            className="w-full bg-gradient-to-r from-[#00f6ff] via-[#16181c] to-[#3fefef] border border-[#00f6ff] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-[0_0_30px_#00f6ff88] relative overflow-hidden"
          >
            <span className={loading2 ? "opacity-80" : ""}>
              {loading2 ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-pulse">
                    <SyncLoader
                      loading={true}
                      color="#00f6ff"
                      size={10}
                      speedMultiplier={1.2}
                    />
                  </span>
                  <span className="animate-pulse text-[#00f6ff] font-semibold drop-shadow-[0_0_10px_#00f6ff]">
                    Generating Post...
                  </span>
                </span>
              ) : (
                "Generate Post"
              )}
            </span>
          </motion.button>

          {/* Caption Display and Edit */}
          {msg && (
            <div className="mt-6 text-[#c084fc] animate-fade-in">
              {!showPreview ? (
                <>
                  <label className="block text-[#3fefef] mb-2">✍️ Edit Caption</label>
                  <textarea
                    className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    rows="4"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Generated"
                      className="mx-auto mt-4 rounded-xl max-w-full border border-[#444]"
                    />
                  )}
                  <button
                    className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-xl transition duration-300"
                    onClick={() => setShowPreview(true)}
                  >
                    Preview on X
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4 mt-4 text-white">
                    <div className="flex items-start gap-3">
                      <img
                        src={user?.photos?.[0]?.value}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{user?.displayName}</span>
                          <span className="text-gray-400">@{user?.username}</span>
                          <span className="text-gray-400 text-sm">· now</span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap">{msg}</p>
                        {image && (
                          <img
                            src={image}
                            alt="Generated"
                            className="mt-3 rounded-2xl border border-[#2f3336] max-w-full"
                          />
                        )}
                        <div className="mt-4 flex text-gray-500 text-sm justify-around">
                          <span>💬 0</span>
                          <span>🔁 0</span>
                          <span>❤️ 0</span>
                          <span>📊</span>
                          <span>🔗</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition duration-300"
                    onClick={() => setShowPreview(false)}
                  >
                    Close Preview
                  </button>
                </>
              )}

              {/* Post Caption Button */}
              <button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition duration-300 disabled:opacity-50"
                onClick={handlePostCaption}
                disabled={loading3 || captionSuccess || isPostBtnClick}
              >
                <span className={loading3 ? "opacity-80" : ""}>
                  {loading3 ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-pulse drop-shadow-[0_0_10px_#c084fc]">
                        <SyncLoader
                          loading={true}
                          color="#c084fc"
                          size={12}
                          speedMultiplier={1.3}
                        />
                      </span>
                      <span className="animate-pulse text-[#c084fc] font-semibold drop-shadow-[0_0_10px_#c084fc]">
                        Posting Caption...
                      </span>
                    </span>
                  ) : captionSuccess ? (
                    "Tweet Posted ✅"
                  ) : (
                    "Post Caption on X"
                  )}
                </span>
              </button>

              {/* Post Caption + Image Button */}
              <button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition duration-300 disabled:opacity-50"
                onClick={handlePost}
                disabled={loading1 || postSuccess || isPostBtnClick}
              >
                <span className={loading1 ? "opacity-80" : ""}>
                  {loading1 ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-pulse drop-shadow-[0_0_10px_#00f6ff]">
                        <SyncLoader
                          loading={true}
                          color="#00f6ff"
                          size={12}
                          speedMultiplier={1.3}
                        />
                      </span>
                      <span className="animate-pulse text-[#00f6ff] font-semibold drop-shadow-[0_0_10px_#00f6ff]">
                        Posting Caption + Image...
                      </span>
                    </span>
                  ) : postSuccess ? (
                    "Tweet Posted ✅"
                  ) : (
                    "Post Caption + Image on X"
                  )}
                </span>
              </button>
            </div>
          )}

          {/* See My Tweets Link */}
          <Link
            to="/allTweets"
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition duration-300"
          >
            See my tweets
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition duration-300"
          >
            Logout
          </button>
        </div>
      </motion.div>
      <Outlet />
    </div>
  );
}