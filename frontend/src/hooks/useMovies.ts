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
      const res = await fetch(`${API_BASE_URL}/movie/${movie.id}/credits`);
      const data = await res.json();
      setSelectedMovie({ ...movie, cast: data.cast });
    } catch (err) {
      console.error("Error fetching credits details:", err);
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