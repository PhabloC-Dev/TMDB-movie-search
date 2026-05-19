import { useState } from "react";
import { type Movie } from "../types";
import { useSearchCatalog } from "./useSearchCatalog";
import { useRatedMovies } from "./useRatedMovies";
import { API_BASE_URL } from "../config"; 

export function useMovies() {
  const [activeTab, setActiveTab] = useState<"search" | "rated">("search");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const searchCatalog = useSearchCatalog();
  const ratedMovies = useRatedMovies(selectedMovie);

  const selectMovieById = async (movie: Movie) => {
    setModalLoading(true);
    setSelectedMovie(movie); 
    
    try {
      const detailRes = await fetch(`${API_BASE_URL}/movie/${movie.id}`);
      const fullMovieData = await detailRes.json();
      const creditsRes = await fetch(`${API_BASE_URL}/movie/${movie.id}/credits`);
      const creditsData = await creditsRes.json(); 
      const derivedGenreIds: number[] =
        (fullMovieData as any).genre_ids ??
        (movie as any).genre_ids ??
        ((fullMovieData as any).genres ? (fullMovieData as any).genres.map((g: any) => g.id) : []);

      setSelectedMovie({ 
        ...fullMovieData, 
        cast: creditsData.cast,
        genre_ids: derivedGenreIds
      });
    } catch (err) {
      console.error("Error fetching comprehensive movie details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    selectedMovie,
    setSelectedMovie,
    selectMovieById,
    modalLoading,
    
    ...searchCatalog,
    ...ratedMovies
  };
}