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
<<<<<<< HEAD
    // Optimistically set the initial data so the modal opens immediately with a loader
    setSelectedMovie(movie); 

    try {
      // 1. 👇 FETCH THE FULL TMDB DETAILS (This hits your backend Python cache!)
      const detailRes = await fetch(`${API_BASE_URL}/movie/${movie.id}`);
      const fullMovieData = await detailRes.json();

      // 2. FETCH THE CREDITS (Also hits your backend Python cache!)
      const creditsRes = await fetch(`${API_BASE_URL}/movie/${movie.id}/credits`);
      const creditsData = await creditsRes.json();
      
      // 3. 👇 COMBINE EVERYTHING: Overwrites the stripped database object with full data
      // Ensure `genre_ids` is preserved/derived so rating preserves genre metadata
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
=======
    setSelectedMovie(movie); 

    try {
      const res = await fetch(`${API_BASE_URL}/movie/${movie.id}/credits`);
      const data = await res.json();
      setSelectedMovie({ ...movie, cast: data.cast });
    } catch (err) {
      console.error("Error fetching credits details:", err);
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
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