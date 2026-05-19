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

<<<<<<< HEAD
// 1. OFFICIAL TMDB MOVIE GENRE LIST (Static and comprehensive)
const TMDB_CATALOG_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

// 2. GENERATE A DYNAMIC ROLLING YEAR ARRAY (From current year back to 1900)
const generateCatalogYears = () => {
  const currentYear = new Date().getFullYear();
  const minYear = 1870;
  const yearsList = [];
  
  for (let y = currentYear; y >= minYear; y--) {
    yearsList.push(y.toString());
  }
  return yearsList;
};

const AVAILABLE_YEARS = generateCatalogYears();

=======
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
export const SearchBar: React.FC<SearchBarProps> = ({
  query, setQuery, onSearch,
  selectedGenre, setSelectedGenre,
  selectedYear, setSelectedYear
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row items-stretch gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
        
<<<<<<< HEAD
        {/* Step 1: text input box */}
=======
        {/* Step 1:text input box*/}
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
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
<<<<<<< HEAD
=======
            
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
            placeholder="Search catalog by title..."
            className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

<<<<<<< HEAD
        {/* Step 2: Genre Dropdown Selector (Dynamic) */}
=======
        {/* Step 2: Genre Dropdown Selector */}
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
        <div className="w-full md:w-48">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
          >
            <option value="">All Genres</option>
<<<<<<< HEAD
            {/* 👇 Mapping dynamically through full TMDB Genre catalog options */}
            {TMDB_CATALOG_GENRES.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Year Dropdown Selector (Dynamic) */}
=======
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
            <option value="878">Sci-Fi</option>
          </select>
        </div>

        {/* Step 3: Year Dropdown Selector */}
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
        <div className="w-full md:w-40">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
          >
            <option value="">All Years</option>
<<<<<<< HEAD
            {/* 👇 Mapping dynamically through calculated chronological loop listing */}
            {AVAILABLE_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
=======
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
          </select>
        </div>

        {/* Step 4: Clear Action or Search Trigger on the far right */}
        <div className="w-full md:w-44 flex gap-2">
          {(selectedGenre || selectedYear) && (
            <button
              type="button"
              onClick={() => { setSelectedGenre(""); setSelectedYear(""); }}
<<<<<<< HEAD
              className="px-2.5 bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-md border border-gray-700 transition-colors text-sm flex items-center justify-center cursor-pointer"
=======
              className="px-2.5 bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-md border border-gray-700 transition-colors text-sm"
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
              title="Clear active filter dropdowns"
            >
              ❌
            </button>
          )}
          
          <button
            onClick={onSearch}
<<<<<<< HEAD
            className="flex-1 bg-blue-600 rounded-md font-bold hover:bg-blue-700 transition-colors text-sm shadow-md py-2.5 text-center px-4 cursor-pointer"
=======
            className="flex-1 bg-blue-600 rounded-md font-bold hover:bg-blue-700 transition-colors text-sm shadow-md py-2.5 text-center px-4"
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
          >
            Search
          </button>
        </div>

      </div>
    </div>
  );
};