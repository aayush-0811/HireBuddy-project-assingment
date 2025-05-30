import React, { useState, useEffect } from "react";

function PopularKeywords() {
  const [keywords, setKeywords] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/search-keywords");
        const data = await res.json();
        setKeywords(data);
      } catch (err) {
        console.error("Failed to fetch keywords:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  // Convert keywords object to sorted array of [keyword, count]
  const sortedKeywords = Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // top 10

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 mt-12 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Popular Search Keywords</h3>
      {loading ? (
        <p>Loading popular keywords...</p>
      ) : sortedKeywords.length === 0 ? (
        <p>No keywords searched yet.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {sortedKeywords.map(([keyword, count]) => (
            <li key={keyword}>
              <strong>{keyword}</strong> — searched {count} time{count > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PopularKeywords;
