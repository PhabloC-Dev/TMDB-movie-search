import React from 'react';
<<<<<<< HEAD
=======
import { type RatedMovie } from '../types';
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec

interface RatedFiltersProps {
  ratedSearchQuery: string;
  setRatedSearchQuery: (val: string) => void;
  ratedScoreFilter: number | "all";
  setRatedScoreFilter: (val: number | "all") => void;
  ratedSelectedGenre: string;
  setRatedSelectedGenre: (val: string) => void;
  ratedSelectedYear: string;
  setRatedSelectedYear: (val: string) => void;
<<<<<<< HEAD
  dbAllYears: string[];
  dbAllGenres: number[];
}

// Map TMDB numerical genre IDs to readable labels
const GENRE_MAP: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

=======
  dbRatedMovies: RatedMovie[];
}

>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
export const RatedFilters: React.FC<RatedFiltersProps> = ({
  ratedSearchQuery, setRatedSearchQuery,
  ratedScoreFilter, setRatedScoreFilter,
  ratedSelectedGenre, setRatedSelectedGenre,
  ratedSelectedYear, setRatedSelectedYear,
<<<<<<< HEAD
  
  // 👇 2. DESTRUCTURE THE NEW ARRAYS HERE
  dbAllYears,
  dbAllGenres
}) => {

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800 mb-8">
      {/* --- TITLE TEXT SEARCH FIELD --- */}
=======
  dbRatedMovies
}) => {

const availableYears = Array.from(
    new Set(
      dbRatedMovies
        .map(movie => movie.release_date?.substring(0, 4))
        .filter(Boolean)
    )
).sort((a, b) => (b || "").localeCompare(a || ""));

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800 mb-8">
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
      <div className="flex-1 min-w-[280px]">
        <input
          type="text" placeholder="Search your rated list by title..." value={ratedSearchQuery}
          onChange={(e) => setRatedSearchQuery(e.target.value)}
          className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
        />
      </div>
      
<<<<<<< HEAD
      {/* --- SCORE RATING SELECTION --- */}
=======
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
      <div className="w-full md:w-48">
        <select
          value={ratedScoreFilter} onChange={(e) => setRatedScoreFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 cursor-pointer text-sm"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4 Stars Only</option>
          <option value="3">3 Stars Only</option>
          <option value="2">2 Stars Only</option>
          <option value="1">1 Star Only</option>
        </select>
      </div>

<<<<<<< HEAD
      {/* --- GENRE FILTER DROPDOWN --- */}
      <div className="w-full md:w-48">
        <select value={ratedSelectedGenre} onChange={(e) => setRatedSelectedGenre(e.target.value)} className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 cursor-pointer text-sm">
          <option value="">All Genres</option>
          {/* 👇 3. LOOP DYNAMICALLY THROUGH ALL GENRES CURRENTLY PRESENT IN DB */}
          {dbAllGenres.map((genreId) => (
            <option key={genreId} value={genreId}>
              {GENRE_MAP[genreId] || `Genre (${genreId})`}
            </option>
          ))}
        </select>
      </div>

      {/* --- YEAR FILTER DROPDOWN --- */}
      <div className="w-full md:w-40">
        <select value={ratedSelectedYear} onChange={(e) => setRatedSelectedYear(e.target.value)} className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 cursor-pointer text-sm">
          <option value="">All Years</option>
          {/* 👇 4. LOOP DYNAMICALLY THROUGH THE BACKEND'S MASTER YEARS LIST */}
          {dbAllYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
=======
      <div className="w-full md:w-48">
        <select value={ratedSelectedGenre} onChange={(e) => setRatedSelectedGenre(e.target.value)} className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 cursor-pointer text-sm">
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="27">Horror</option>
          <option value="878">Sci-Fi</option>
        </select>
      </div>

      <div className="w-full md:w-40">
        <select value={ratedSelectedYear} onChange={(e) => setRatedSelectedYear(e.target.value)} className="w-full h-full bg-gray-800 text-white px-4 py-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 cursor-pointer text-sm">
          <option value="">All Years</option>
          {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
        </select>
      </div>
    </div>
  );
};