import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
axios.defaults.withCredentials = true;

export default function App() {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [interest, setInterest] = useState("tech");
  const [captionType, setCaptionType] = useState("motivational");
  const [gender, setGender] = useState("neutral");
  const [msg, setMsg] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false); // for "Post on X"
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/auth/twitter/session",
          {
            withCredentials: true,
          }
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

  const handlePost = async () => {
    setLoading1(true);
    setPostSuccess(false);
    try {
      const res = await axios.post("http://localhost:3000/tweet/post", {
        token,
        secret,
        msg,
      });
      setPostSuccess(true);
    } catch (err) {
      console.log(err);
      setMsg("❌ Something went wrong!");
    }
    setLoading1(false);
  };

  const generatePost = async () => {
    setLoading2(true);

    try {
      const res = await axios.post("http://localhost:3000/tweet", {
        token,
        secret,
        interest,
        captionType,
        gender,
      });
      setImage(res.data.image || null);

      setMsg(res.data.caption || "Tweet posted!");
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setLoading2(false);
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
    { value: "meme-lord", label: "Meme-Lord" },
    { value: "professor-vibes", label: "Professor Vibes" },
    { value: "soft-aesthetic", label: "Soft Aesthetic" },
    { value: "future-forward", label: "Future-Forward" },
    { value: "hustle-culture", label: "Hustle Culture" },
    { value: "minimalist", label: "Minimalist" },
    { value: "ceo-grindset", label: "CEO Grindset" },
    { value: "growth-guru", label: "Growth Guru" },
    { value: "page-turner", label: "Page-Turner" },
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
        className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md p-10 rounded-2xl border border-[#3fefef] shadow-[0_0_25px_#3fefef80] max-w-lg mx-auto "
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
            onClick={generatePost}
            disabled={loading2}
            className="w-full bg-black border border-[#3fefef] text-[#3fefef] font-semibold py-3 rounded-xl transition duration-300 hover:shadow-[0_0_20px_#3fefefaa]"
          >
            {loading2 ? "Generating Post..." : "Generate Post"}
          </motion.button>

          {msg && (
            <div className="mt-6 text-[#c084fc] animate-fade-in">
              {/* Tweet-style preview toggle */}
              {!showPreview ? (
                <>
                  <p className="text-center whitespace-pre-wrap">{msg}</p>
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
                  {/* X-style tweet preview */}
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
                          <span className="text-gray-400">
                            @{user?.username}
                          </span>
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

                  {/* Close Preview Button */}
                  <button
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition duration-300"
                    onClick={() => setShowPreview(false)}
                  >
                    Close Preview
                  </button>
                </>
              )}

              {/* Post on X button */}
              <button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition duration-300 disabled:opacity-50"
                onClick={handlePost}
                disabled={loading1 || postSuccess}
              >
                {loading1
                  ? "Posting..."
                  : postSuccess
                  ? "Tweet Posted ✅"
                  : "Post on X"}
              </button>
            </div>
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
