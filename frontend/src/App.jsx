import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function App() {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [interest, setInterest] = useState("tech");
  const [captionType, setCaptionType] = useState("motivational");
  const [gender, setGender] = useState("neutral");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    const s = params.get("secret");
    if (t && s) {
      setToken(t);
      setSecret(s);
    }
  }, []);

  const handlePost = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/tweet", {
        token,
        secret,
        interest,
        captionType,
        gender,
      });
      setMsg(res.data.caption || "Tweet posted!");
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setLoading(false);
  };

  const logout = () => {
    window.location.href = "http://localhost:3000/auth/twitter/logout";
  };

  const interests = [
    "Tech",
    "Funny",
    "Finance",
    "Memes",
    "Motivation",
    "DevLife",
    "Gaming",
    "Cyber Security",
    "Health",
    "Education",
    "Fitness",
    "Travel",
    "Food",
    "Fashion",
    "Music",
    "Art",
    "Sports",
    "News",
    "Lifestyle",
    "AI",
    "Startups",
    "Productivity",
    "Emotional Growth",
    "Spirituality",
    "Business",
    "Marketing",
    "Books",
  ];

  const captionStyles = [
    { value: "motivational", label: "Motivational Speaker" },
    { value: "funny", label: "Funny Tone" },
    { value: "savage", label: "Savage" },
    { value: "weird", label: "Weirdly Cool" },
    { value: "chill", label: "Chill & Relatable" },
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
            href="http://localhost:3000/auth/twitter/login"
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
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#3fefef] animate-pulse">
          Welcome, Twitter Warrior!
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-[#3fefef] mb-2">
              🎯 Select Interest
            </label>
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
          
          <div>
            <label className="block text-[#3fefef] mb-2">
              👤 Select Gender
            </label>
            <select
              className="w-full bg-black border border-[#3fefef] p-3 rounded-xl text-white focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="neutral">Neutral</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-[#3fefef] mb-2">
              🎤 Caption Style
            </label>
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePost}
            disabled={loading}
            className="w-full bg-black border border-[#3fefef] text-[#3fefef] font-semibold py-3 rounded-xl transition duration-300 hover:shadow-[0_0_20px_#3fefefaa]"
          >
            {loading ? "Posting..." : "Generate & Post"}
          </motion.button>
          {msg && (
            <p className="text-center mt-4 text-[#c084fc] animate-fade-in">
              {msg}
            </p>
          )}
          <button
            onClick={logout}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition duration-300"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
