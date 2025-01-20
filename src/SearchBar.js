const SearchBar = ({ keyword, onChange }) => {
  return (
    <input
      className="border border-gray-300 px-5 py-2 w-full rounded-full bg-gray-100"
      key="search-bar"
      value={keyword}
      placeholder={"Search news..."}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
