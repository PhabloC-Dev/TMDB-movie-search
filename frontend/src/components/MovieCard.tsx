import React from 'react';
import { type Movie } from '../types';

//What data a MovieCard needs
interface MovieCardProps {
  movie: Movie; 
  onClick: () => void;
  ratingLabel?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, ratingLabel }) => {
  return (
    <div 
      onClick={onClick} 
      className="relative group overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
    >
      {/* The Poster Image */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto transition-all duration-300 group-hover:scale-110 group-hover:brightness-50"
      />

      {/* The Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <h3 className="text-xl font-bold text-white leading-tight">{movie.title}</h3>
        <p className="text-sm text-gray-300">{movie.release_date}</p>
        <div className="text-yellow-400 font-bold mt-1">
          {ratingLabel ? ratingLabel : `★ ${movie.vote_average?.toFixed(1)}`}
        </div>
      </div>
    </div>
  );
};