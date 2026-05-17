import { useState, useEffect } from "react";
import { type Movie, type RatedMovie } from "../types";
import { API_BASE_URL } from "../config";

export function useRatedMovies(
  selectedMovie: Movie | null,
) {
  const [userRatings, setUserRatings] = useState<{ [movieId: number]: number }>({});
  const [dbRatedMovies, setDbRatedMovies] = useState<RatedMovie[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  
  const [ratedSearchQuery, setRatedSearchQuery] = useState("");
  const [ratedScoreFilter, setRatedScoreFilter] = useState<number | "all">("all");
  const [ratedSelectedGenre, setRatedSelectedGenre] = useState("");
  const [ratedSelectedYear, setRatedSelectedYear] = useState("");

  // Hydrate from Database
  useEffect(() => {
    const fetchSavedRatings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rated`);
        const simpleData: RatedMovie[] = await res.json();
        
        const ratingsMap: { [key: number]: number } = {};
        simpleData.forEach((item) => {
          ratingsMap[item.id] = item.rating;
        });
        setUserRatings(ratingsMap);
        setDbRatedMovies(simpleData);
      } catch (err) {
        console.error("Could not load ratings from database:", err);
      } finally {
        setDbLoading(false);
      }
    };
    
    fetchSavedRatings();
  }, []);

  const filteredDatabaseMovies = dbRatedMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(ratedSearchQuery.toLowerCase());
    const matchesStars = ratedScoreFilter === "all" ? true : movie.rating === Number(ratedScoreFilter);
    const matchesGenre = ratedSelectedGenre ? movie.genre_ids?.includes(Number(ratedSelectedGenre)) : true;
    const matchesYear = ratedSelectedYear ? movie.release_date?.startsWith(ratedSelectedYear) : true;
    return matchesSearch && matchesStars && matchesGenre && matchesYear;
  });

  const handleRateMovie = async (id: number, star: number) => {
    const isUndo = userRatings[id] === star;

    if (isUndo) {
      const newRatings = { ...userRatings };
      delete newRatings[id];
      setUserRatings(newRatings);
      setDbRatedMovies(dbRatedMovies.filter(m => m.id !== id));

      try {
        await fetch(`${API_BASE_URL}/rate/${id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error deleting rating:", err);
      }
    } else {
      setUserRatings({ ...userRatings, [id]: star });

      const updatedMovie: RatedMovie = {
        id,
        title: selectedMovie!.title,
        poster_path: selectedMovie!.poster_path,
        rating: star,
        genre_ids: selectedMovie!.genre_ids || [],
        release_date: selectedMovie!.release_date || ""
      };
      
      if (dbRatedMovies.some(m => m.id === id)) {
        setDbRatedMovies(dbRatedMovies.map(m => m.id === id ? updatedMovie : m));
      } else {
        setDbRatedMovies([...dbRatedMovies, updatedMovie]);
      }

      try {
        await fetch(`${API_BASE_URL}/rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            movieId: id, 
            rating: star,
            title: selectedMovie!.title,          
            posterPath: selectedMovie!.poster_path,
            genre_ids: selectedMovie!.genre_ids || [],
            release_date: selectedMovie!.release_date || ""
          }),
        });
      } catch (err) {
        console.error("Error saving rating:", err);
      }
    }
  };

  return {
    userRatings,
    dbRatedMovies,
    dbLoading,
    ratedSearchQuery, setRatedSearchQuery,
    ratedScoreFilter, setRatedScoreFilter,
    ratedSelectedGenre, setRatedSelectedGenre,
    ratedSelectedYear, setRatedSelectedYear,
    filteredDatabaseMovies,
    handleRateMovie
  };
}