import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessSecret: '',
    interest: 'tech',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/generate-post', formData);
      setMsg(res.data.message || 'Posted successfully!');
    } catch (error) {
      setMsg('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Twitter Auto Poster</h1>
        <input className="input" name="apiKey" placeholder="API Key" onChange={handleChange} />
        <input className="input" name="apiSecret" placeholder="API Secret" onChange={handleChange} />
        <input className="input" name="accessToken" placeholder="Access Token" onChange={handleChange} />
        <input className="input" name="accessSecret" placeholder="Access Secret" onChange={handleChange} />

        <select name="interest" className="input" onChange={handleChange}>
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
          onClick={handleSubmit}
          className="bg-indigo-600 text-white py-2 px-4 mt-4 rounded-xl w-full hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Generate & Post'}
        </button>

        {msg && <p className="text-center mt-4 text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}
