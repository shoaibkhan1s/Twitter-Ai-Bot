import { useState, useEffect } from "react";
import axios from "axios";

export default function AllTweets() {
  const [allTweets, setAllTweets] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const seeTweets = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/seeTweets`,
          { withCredentials: true }
        );
        setAllTweets(res.data);
      } catch (err) {
        setError("Failed to load tweets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    seeTweets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">All Tweets</h2>

      {isLoading && (
        <p className="text-center text-gray-600">Loading tweets...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!isLoading && !error && allTweets.length === 0 ? (
        <p className="text-center text-gray-600">No tweets found.</p>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {allTweets.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <p className="text-gray-800 mb-2">
                <span className="font-semibold text-blue-600">Tweet:</span>{" "}
                {item.caption || "No content available"}
              </p>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="Tweet"
                  className="w-full rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
