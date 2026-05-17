import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: () => void;
  selectedGenre: string;
  setSelectedGenre: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query, setQuery, onSearch,
  selectedGenre, setSelectedGenre,
  selectedYear, setSelectedYear
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row items-stretch gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
        
        {/* Step 1:text input box*/}
        <div className="flex-1 min-w-[280px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            
            placeholder="Search catalog by title..."
            className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Step 2: Genre Dropdown Selector */}
        <div className="w-full md:w-48">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
          >
            <option value="">All Genres</option>
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
            <option value="878">Sci-Fi</option>
          </select>
        </div>

        {/* Step 3: Year Dropdown Selector */}
        <div className="w-full md:w-40">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        {/* Step 4: Clear Action or Search Trigger on the far right */}
        <div className="w-full md:w-44 flex gap-2">
          {(selectedGenre || selectedYear) && (
            <button
              type="button"
              onClick={() => { setSelectedGenre(""); setSelectedYear(""); }}
              className="px-2.5 bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-md border border-gray-700 transition-colors text-sm"
              title="Clear active filter dropdowns"
            >
              ❌
            </button>
          )}
          
          <button
            onClick={onSearch}
            className="flex-1 bg-blue-600 rounded-md font-bold hover:bg-blue-700 transition-colors text-sm shadow-md py-2.5 text-center px-4"
          >
            Search
          </button>
        </div>

      </div>
    </div>
  );
};