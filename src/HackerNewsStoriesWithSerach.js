import { useState, useEffect } from 'react';
import HackerNewsStories from './HackerNewsStories';
import SearchBar from './SearchBar';

const HackerNewsStoriesWithSearch = () => {
  const [stories, setStories] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

  const fetchStories = async () => {
    try {
      const data = await (await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=20')).json();
      const stortedStories = data.hits.sort((story, nextStory) => (story.points < nextStory.points ? 1 : -1));
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

  const updateKeyword = async (keyword) => {
    const filtered = allStories.filter(story => {
     return story.title.toLowerCase().includes(keyword.toLowerCase())
    })
    setKeyword(keyword);
    setStories(filtered);
 }

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <> { /* React fragment */}
    <div className="wrapper">
      <h2>Latest HN Stories</h2>
      {loading && <div>HackerNews frontpage stories loading...</div>}
      {error && <div>{`Problem fetching the HackeNews Stories - ${error}`}</div>}
      <SearchBar keyword={keyword} onChange={updateKeyword}/>
      <HackerNewsStories stories={stories} />
    </div>
    </>
  )
}

export default HackerNewsStoriesWithSearch;