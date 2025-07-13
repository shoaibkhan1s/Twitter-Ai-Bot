import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [interest, setInterest] = useState('tech');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    const s = params.get('secret');
    if (t && s) {
      setToken(t);
      setSecret(s);
    }
  }, []);

  const handlePost = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/tweet', {
        token,
        secret,
        interest
      });
      setMsg(res.data.caption || 'Tweet posted!');
    } catch (err) {
      setMsg('❌ Something went wrong!');
    }
    setLoading(false);
  };

  if (!token || !secret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-6">Twitter Auto Poster</h1>
          <a
            href="http://localhost:3000/auth/twitter/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl"
          >
            Login with Twitter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome!</h1>

        <label className="block mb-2 text-gray-700">Select Interest</label>
        <select
          className="w-full p-2 border rounded-xl mb-4"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          <option value="tech">Tech</option>
          <option value="funny">Funny</option>
          <option value="finance">Finance</option>
          <option value="memes">Memes</option>
          <option value="motivation">Motivation</option>
          <option value="devlife">DevLife</option>
          <option value="gaming">Gaming</option>
          <option value="cybersecurity">Cyber Security</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="fitness">Fitness</option>
          <option value="travel">Travel</option>
          <option value="food">Food</option>
          <option value="fashion">Fashion</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="sports">Sports</option>
          <option value="news">News</option>
          <option value="lifestyle">Lifestyle</option>
        </select>

        <button
          onClick={handlePost}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl"
        >
          {loading ? 'Posting...' : 'Generate & Post'}
        </button>

        {msg && <p className="mt-4 text-center text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}