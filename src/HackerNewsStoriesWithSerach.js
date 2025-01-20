import { useState, useEffect } from "react";
import HackerNewsStories from "./HackerNewsStories";
import SearchBar from "./SearchBar";

const HackerNewsStoriesWithSearch = () => {
  const [stories, setStories] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fetchStories = async () => {
    try {
      const { hits } = await (
        await fetch(
          "https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=30"
        )
      ).json();
      const stortedStories = hits.sort((story, nextStory) =>
        (story.points ?? 0) < nextStory.points ? 1 : -1
      );
      setAllStories(stortedStories);
      setStories(stortedStories);
      setError(null);
    } catch (err) {
      setError(err.message);
      setStories(null);
    } finally {
      setLoading(false);
    }
  };

  const updateKeyword = (keyword) => {
    const filtered = allStories.filter((story) => {
      return `${story.title.toLowerCase()} ${story.author.toLowerCase()}`.includes(
        keyword.toLowerCase()
      );
    });
    setKeyword(keyword);
    setStories(filtered);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <>
      {/* React fragment */}
      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-2xl font-bold text-center">Latest HN Stories</h2>
        <SearchBar keyword={keyword} onChange={updateKeyword} />
        {loading && (
          <svg
            className="animate-spin mx-auto h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {error && (
          <div className="p-2 bg-red-500 text-sm text-white rounded">{`Problem fetching the HackeNews Stories - ${error}`}</div>
        )}
        <HackerNewsStories stories={stories} />
      </div>
    </>
  );
};

export default HackerNewsStoriesWithSearch;
