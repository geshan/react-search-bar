const HackerNewsStories = ({ stories = [] }) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {stories &&
        stories.map(
          ({ objectID, url, title, author, points, _tags }) =>
            title &&
            url && (
              <a
                className="hover:drop-shadow"
                href={url}
                target="_blank"
                rel="noreferrer"
                key={objectID}
              >
                <div className="p-2 bg-gray-100 rounded">
                  <h3 className="text-md">{title}</h3>
                  <div className="text-sm text-gray-600">
                    By <b>{author}</b> ({points} points)
                  </div>
                </div>
              </a>
            )
        )}
    </div>
  );
};

export default HackerNewsStories;
