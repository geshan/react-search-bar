import { useState, useEffect } from 'react';

const HackerNewsStories = () => {
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await (await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=25')).json();
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
    fetchUsers();
  }, []);

  return (
    <div className="wrapper">
      <h2>Latest HN Stories</h2>
      {loading && <div>HackerNews frontpage stories loading...</div>}
      {error && <div>{`Problem fetching the HackeNews Stories - ${error}`}</div>}
      <div className="stories-wrapper">
        {stories &&
          stories.map(({ objectID, url, title, author, points }) => (
            title && url &&
            <div className='stories-list' key={objectID}>
              <h3><a href={url} target="_blank" rel="noreferrer">{title}</a> - By {author} ({points} points)</h3>
            </div>                        
          ))}
      </div>
    </div>
  );
};

export default HackerNewsStories;
