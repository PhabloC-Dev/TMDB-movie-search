import React from 'react';
import { MovieCard } from './MovieCard';
import { RatedFilters } from './RatedFilters';
import { type Movie, type RatedMovie } from '../types';
import { API_BASE_URL } from '../config';

interface RatedMoviesTabProps {
  dbRatedMovies: RatedMovie[];
  filteredDatabaseMovies: RatedMovie[];
  userRatings: { [movieId: number]: number };
  setActiveTab: (tab: "search" | "rated") => void;
  setSelectedMovie: (movie: Movie | null) => void;
  ratedSearchQuery: string;
  setRatedSearchQuery: (val: string) => void;
  ratedScoreFilter: number | "all";
  setRatedScoreFilter: (val: number | "all") => void;
  ratedSelectedGenre: string;
  setRatedSelectedGenre: (val: string) => void;
  ratedSelectedYear: string;
  setRatedSelectedYear: (val: string) => void;
}

export const RatedMoviesTab: React.FC<RatedMoviesTabProps> = (props) => {
  // Empty state handling
  if (props.dbRatedMovies.length === 0) {
    return (
      <div className="text-center text-gray-400 text-lg mt-12 py-8 bg-gray-900/50 rounded-xl max-w-xl mx-auto border border-gray-800">
        <p className="mb-2">You haven't rated any movies yet!</p>
        <button 
          onClick={() => props.setActiveTab("search")} 
          className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md mt-2 text-white font-semibold transition-colors cursor-pointer"
        >
          Go browse films
        </button>
      </div>
    );
  }

  const handleSavedMovieClick = async (movie: RatedMovie) => {
    try {
      const movieRes = await fetch(`${API_BASE_URL}/movie/${movie.id}`);
      const movieData = await movieRes.json();
      
      const creditsRes = await fetch(`${API_BASE_URL}/movie/${movie.id}/credits`);
      const creditsData = await creditsRes.json();
      
      props.setSelectedMovie({ ...movieData, cast: creditsData.cast });
    } catch (err) {
      console.error("Error loading comprehensive movie metadata:", err);
    }
  };

  return (
    <div>
      {/* --- RATED FILTER PANEL BAR --- */}
      <RatedFilters 
        ratedSearchQuery={props.ratedSearchQuery} setRatedSearchQuery={props.setRatedSearchQuery}
        ratedScoreFilter={props.ratedScoreFilter} setRatedScoreFilter={props.setRatedScoreFilter}
        ratedSelectedGenre={props.ratedSelectedGenre} setRatedSelectedGenre={props.setRatedSelectedGenre}
        ratedSelectedYear={props.ratedSelectedYear} setRatedSelectedYear={props.setRatedSelectedYear}
        dbRatedMovies={props.dbRatedMovies}
      />

      {/* --- RATED MOVIES GRID SYSTEM --- */}
      {props.filteredDatabaseMovies.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-8">No rated movies match your specific search criteria.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {props.filteredDatabaseMovies.map((movie) => (
            <div key={movie.id} className="relative group cursor-pointer">
              <MovieCard 
                movie={{
                  id: movie.id, title: movie.title, poster_path: movie.poster_path,
                  overview: "", release_date: movie.release_date || "", 
                  genre_ids: movie.genre_ids || [], vote_average: 0
                }}
                onClick={() => handleSavedMovieClick(movie)}
                ratingLabel={`Your rating: ${props.userRatings[movie.id]} ★`} 
              />
              <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded shadow-md pointer-events-none">
                {props.userRatings[movie.id]} ★
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};