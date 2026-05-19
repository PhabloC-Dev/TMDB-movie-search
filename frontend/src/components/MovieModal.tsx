import React from 'react';
import { type Movie, type CastMember } from '../types';

interface MovieModalProps {
  movie: Movie;
  userRatings: { [key: number]: number };
  onClose: () => void;
  onRate: (movieId: number, rating: number) => void;
  isLoading: boolean;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, userRatings, onClose, onRate, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-500 cursor-pointer"
        >
          ✕
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-300 animate-pulse font-semibold text-lg">Fetching cast details...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded mb-4 mx-auto max-h-[300px] object-cover"
            />
            <p className="text-gray-300 mb-2">Release: {movie.release_date}</p>
            <p className="text-yellow-400 font-bold mb-2">
              ★ {movie.vote_average?.toFixed(1)}
            </p>
            <p className="text-gray-200">{movie.overview}</p>

            {movie.cast && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Cast</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  {movie.cast.slice(0, 10).map((actor: CastMember) => (
                    <li key={actor.cast_id}>
                      {actor.name} as {actor.character}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="text-lg font-bold mb-2">Give your rating</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRate(movie.id, star)}
                    className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                      (userRatings[movie.id] || 0) >= star
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};