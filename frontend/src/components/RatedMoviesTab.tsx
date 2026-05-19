import React from 'react';
import { MovieCard } from './MovieCard';
import { RatedFilters } from './RatedFilters';
import { type RatedMovie } from '../types';

interface RatedMoviesTabProps {
  dbRatedMovies: RatedMovie[];
  filteredDatabaseMovies: RatedMovie[];
  userRatings: { [movieId: number]: number };
  setActiveTab: (tab: "search" | "rated") => void;
  selectMovieById: (movie: any) => void;
  ratedSearchQuery: string;
  setRatedSearchQuery: (val: string) => void;
  ratedScoreFilter: number | "all";
  setRatedScoreFilter: (val: number | "all") => void;
  ratedSelectedGenre: string;
  setRatedSelectedGenre: (val: string) => void;
  ratedSelectedYear: string;
  setRatedSelectedYear: (val: string) => void;
  
  dbPage: number;
  dbTotalPages: number;
  setDbPage: (page: number) => void;

  dbAllYears: string[];
  dbAllGenres: number[];
}

export const RatedMoviesTab: React.FC<RatedMoviesTabProps> = (props) => {
  
  const hasActiveFilters = 
    props.ratedSearchQuery !== "" || 
    props.ratedScoreFilter !== "all" || 
    props.ratedSelectedGenre !== "" || 
    props.ratedSelectedYear !== "";

  if (props.dbRatedMovies.length === 0 && !hasActiveFilters) {
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

  return (
    <div>
      <RatedFilters 
        ratedSearchQuery={props.ratedSearchQuery} setRatedSearchQuery={props.setRatedSearchQuery}
        ratedScoreFilter={props.ratedScoreFilter} setRatedScoreFilter={props.setRatedScoreFilter}
        ratedSelectedGenre={props.ratedSelectedGenre} setRatedSelectedGenre={props.setRatedSelectedGenre}
        ratedSelectedYear={props.ratedSelectedYear} setRatedSelectedYear={props.setRatedSelectedYear}
        dbAllYears={props.dbAllYears}
        dbAllGenres={props.dbAllGenres}
      />

      {props.filteredDatabaseMovies.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-8">No rated movies match your specific search criteria.</p>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {props.filteredDatabaseMovies.map((movie) => (
              <div key={movie.id} className="relative group cursor-pointer">
                <MovieCard 
                  movie={movie as any} 
                  onClick={() => props.selectMovieById(movie)}
                  ratingLabel={`Your rating: ${props.userRatings[movie.id]} ★`} 
                />
                <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded shadow-md pointer-events-none">
                  {props.userRatings[movie.id]} ★
                </div>
              </div>
            ))}
          </div>

          {props.dbTotalPages > 1 && (
            <div className="flex flex-col items-center justify-center space-y-2 mt-12 pt-6 border-t border-gray-900">
              <div className="text-sm text-gray-400">
                Page <strong className="text-white">{props.dbPage}</strong> of <strong className="text-white">{props.dbTotalPages}</strong>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  disabled={props.dbPage === 1}
                  onClick={() => props.setDbPage(props.dbPage - 1)}
                  className="w-40 py-2 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold text-white cursor-pointer flex items-center justify-center"
                >
                  Previous Page
                </button>

                <button
                  disabled={props.dbPage === props.dbTotalPages}
                  onClick={() => props.setDbPage(props.dbPage + 1)}
                  className="w-40 py-2 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold text-white cursor-pointer flex items-center justify-center"
                >
                  Next Page
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};