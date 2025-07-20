import { useState, useEffect } from "react";
import axios from "axios";

export default function AllTweets() {
  const [allTweets, setAllTweets] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added for loading state

  useEffect(() => {
    const seeTweets = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/seeTweets`,
          { withCredentials: true }
        );
        console.log("API Response:", res.data); // Debug: Log raw response
        setAllTweets(res.data); // Ensure res.data is an array
      } catch (err) {
        console.error("Error fetching tweets:", err);
        setError("Failed to load tweets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    seeTweets();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading tweets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && allTweets.length === 0 ? (
        <p>No tweets found.</p>
      ) : (
        allTweets.map((item, index) => (
          <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p>Tweet: {item.caption || "No content available"}</p> {/* Adjust based on data structure */}
            <p>Debug: {JSON.stringify(item)}</p> {/* Debug: Show raw item data */}
          </div>
        ))
      )}
    </div>
  );
}