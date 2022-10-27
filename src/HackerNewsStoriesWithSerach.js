import { useState, useEffect } from 'react';
import HackerNewsStories from './HackerNewsStories';

const HackerNewsStoriesWithSearch = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStories = async () => {
    try {
      const data = await (await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=20')).json();
      setStories(
        data.hits.sort((story, nextStory) => (story.points < nextStory.points ? 1 : -1))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      setStories(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <> { /* React fragment */}
    <div className="wrapper">
      <h2>Latest HN Stories</h2>
      {loading && <div>HackerNews frontpage stories loading...</div>}
      {error && <div>{`Problem fetching the HackeNews Stories - ${error}`}</div>}      
      <HackerNewsStories stories={stories} />
    </div>
    </>
  )
}

export default HackerNewsStoriesWithSearch;