<<<<<<< HEAD
import { useState, useEffect, useMemo } from "react";
import { type Movie, type RatedMovie } from "../types";
import { API_BASE_URL } from "../config";

export function useRatedMovies(selectedMovie: Movie | null) {
=======
import { useState, useEffect } from "react";
import { type Movie, type RatedMovie } from "../types";
import { API_BASE_URL } from "../config";

export function useRatedMovies(
  selectedMovie: Movie | null,
) {
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
  const [userRatings, setUserRatings] = useState<{ [movieId: number]: number }>({});
  const [dbRatedMovies, setDbRatedMovies] = useState<RatedMovie[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  
<<<<<<< HEAD
  const [dbPage, setDbPage] = useState(1);
  const [dbTotalPages, setDbTotalPages] = useState(1);
  const [dbTotalResults, setDbTotalResults] = useState(0);

  const [dbAllYears, setDbAllYears] = useState<string[]>([]);
  const [dbAllGenres, setDbAllGenres] = useState<number[]>([]);

=======
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
  const [ratedSearchQuery, setRatedSearchQuery] = useState("");
  const [ratedScoreFilter, setRatedScoreFilter] = useState<number | "all">("all");
  const [ratedSelectedGenre, setRatedSelectedGenre] = useState("");
  const [ratedSelectedYear, setRatedSelectedYear] = useState("");

<<<<<<< HEAD
  // Dynamically reset pagination page when filters change (Local UX logic)
  useEffect(() => {
    setDbPage(1);
  }, [ratedSearchQuery, ratedScoreFilter, ratedSelectedGenre, ratedSelectedYear]);

  // Helper trigger to handle forced refetches during mutations (rate / unrate action)
  const [refreshNonce, setRefreshNonce] = useState(0);
  const triggerRefetch = () => setRefreshNonce(prev => prev + 1);

  // 👇 FIXED: This network effect ONLY runs when changing pages or completing a rating action
  useEffect(() => {
    const fetchSavedRatings = async () => {
      setDbLoading(true);
      try {
        // We only request the baseline structural page from the server
        const params = new URLSearchParams({
          page: dbPage.toString()
        });

        const res = await fetch(`${API_BASE_URL}/rated?${params.toString()}`);
        const data = await res.json();
        
        const itemsList: RatedMovie[] = data.results || [];
        setDbTotalPages(data.total_pages || 1);
        setDbTotalResults(data.total_results || 0);
        
        setDbAllYears(data.all_years || []);
        setDbAllGenres(data.all_genres || []);

        const ratingsMap: { [key: number]: number } = {};
        itemsList.forEach((item) => {
          ratingsMap[item.id] = item.rating;
        });
        
        setUserRatings(prev => ({ ...prev, ...ratingsMap }));
        setDbRatedMovies(itemsList);
        
=======
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
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
      } catch (err) {
        console.error("Could not load ratings from database:", err);
      } finally {
        setDbLoading(false);
      }
    };
    
    fetchSavedRatings();
<<<<<<< HEAD
  }, [dbPage, refreshNonce]); // 👈 Filters removed entirely! No more API spamming.

  // 👇 INSTANT CLIENT-SIDE FILTERING VIA MEMOIZED STATE
  const filteredDatabaseMovies = useMemo(() => {
    return dbRatedMovies.filter((movie) => {
      // 1. Text Search Filter
      if (ratedSearchQuery.trim() !== "") {
        const matchesQuery = movie.title.toLowerCase().includes(ratedSearchQuery.toLowerCase());
        if (!matchesQuery) return false;
      }

      // 2. Score Filter
      if (ratedScoreFilter !== "all") {
        if (movie.rating !== Number(ratedScoreFilter)) return false;
      }

      // 3. Genre Filter
      if (ratedSelectedGenre !== "") {
        const genreIdNum = Number(ratedSelectedGenre);
        if (!movie.genre_ids?.includes(genreIdNum)) return false;
      }

      // 4. Year Filter
      if (ratedSelectedYear !== "") {
        const movieYear = movie.release_date?.slice(0, 4);
        if (movieYear !== ratedSelectedYear) return false;
      }

      return true;
    });
  }, [dbRatedMovies, ratedSearchQuery, ratedScoreFilter, ratedSelectedGenre, ratedSelectedYear]);
=======
  }, []);

  const filteredDatabaseMovies = dbRatedMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(ratedSearchQuery.toLowerCase());
    const matchesStars = ratedScoreFilter === "all" ? true : movie.rating === Number(ratedScoreFilter);
    const matchesGenre = ratedSelectedGenre ? movie.genre_ids?.includes(Number(ratedSelectedGenre)) : true;
    const matchesYear = ratedSelectedYear ? movie.release_date?.startsWith(ratedSelectedYear) : true;
    return matchesSearch && matchesStars && matchesGenre && matchesYear;
  });
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec

  const handleRateMovie = async (id: number, star: number) => {
    const isUndo = userRatings[id] === star;

    if (isUndo) {
      const newRatings = { ...userRatings };
      delete newRatings[id];
      setUserRatings(newRatings);
<<<<<<< HEAD
      
      const deletedMovie = dbRatedMovies.find(m => m.id === id);
      const filteredMovies = dbRatedMovies.filter(m => m.id !== id);
      setDbRatedMovies(filteredMovies);
      setDbTotalResults(prev => Math.max(0, prev - 1));
      
      if (deletedMovie) {
        const deletedYear = deletedMovie.release_date?.slice(0, 4);
        if (deletedYear && !filteredMovies.some(m => m.release_date?.slice(0, 4) === deletedYear)) {
          setDbAllYears(prev => prev.filter(y => y !== deletedYear));
        }
        
        if (deletedMovie.genre_ids && deletedMovie.genre_ids.length > 0) {
          const orphanedGenres = deletedMovie.genre_ids.filter(gId => 
            !filteredMovies.some(m => m.genre_ids?.includes(gId))
          );
          if (orphanedGenres.length > 0) {
            setDbAllGenres(prev => prev.filter(g => !orphanedGenres.includes(g)));
          }
        }
      }
      
      try {
        await fetch(`${API_BASE_URL}/rate/${id}`, { method: "DELETE" });
        triggerRefetch(); // Soft sync with backend context
=======
      setDbRatedMovies(dbRatedMovies.filter(m => m.id !== id));

      try {
        await fetch(`${API_BASE_URL}/rate/${id}`, { method: "DELETE" });
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
      } catch (err) {
        console.error("Error deleting rating:", err);
      }
    } else {
<<<<<<< HEAD
      const isNewRating = !userRatings[id];
=======
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
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
<<<<<<< HEAD
        setDbRatedMovies([updatedMovie, ...dbRatedMovies.slice(0, 19)]);
        if (isNewRating) setDbTotalResults(prev => prev + 1);
        
        const movieYear = updatedMovie.release_date?.slice(0, 4);
        if (movieYear && !dbAllYears.includes(movieYear)) {
          setDbAllYears(prev => [...prev, movieYear].sort().reverse());
        }
        
        if (updatedMovie.genre_ids && updatedMovie.genre_ids.length > 0) {
          const newGenres = updatedMovie.genre_ids.filter(gId => !dbAllGenres.includes(gId));
          if (newGenres.length > 0) {
            setDbAllGenres(prev => [...prev, ...newGenres].sort((a, b) => a - b));
          }
        }
=======
        setDbRatedMovies([...dbRatedMovies, updatedMovie]);
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
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
<<<<<<< HEAD
        triggerRefetch(); // Soft sync with backend context
=======
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
      } catch (err) {
        console.error("Error saving rating:", err);
      }
    }
  };

  return {
    userRatings,
    dbRatedMovies,
    dbLoading,
<<<<<<< HEAD
    dbPage,
    dbTotalPages,
    dbTotalResults,
    dbAllYears,   
    dbAllGenres,  
    setDbPage,     
=======
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
    ratedSearchQuery, setRatedSearchQuery,
    ratedScoreFilter, setRatedScoreFilter,
    ratedSelectedGenre, setRatedSelectedGenre,
    ratedSelectedYear, setRatedSelectedYear,
<<<<<<< HEAD
    filteredDatabaseMovies, // 👈 Emits the fast memoized collection seamlessly
=======
    filteredDatabaseMovies,
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
    handleRateMovie
  };
}