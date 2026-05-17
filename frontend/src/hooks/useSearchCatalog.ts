import { useState } from "react";
import { type Movie } from "../types";
import { API_BASE_URL } from "../config";

//Everything related to the TMDB API search tab.

export function useSearchCatalog() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");

  const searchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/search?q=${query}`);
      const data = await res.json();
      setResults(data.results || []);
      setSearchedQuery(query); 
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((movie) => {
    const matchesGenre = selectedGenre ? movie.genre_ids?.includes(Number(selectedGenre)) : true;
    const matchesYear = selectedYear ? movie.release_date?.startsWith(selectedYear) : true;
    return matchesGenre && matchesYear;
  });

  return {
    query, setQuery,
    results, setResults,
    loading, setLoading,
    selectedGenre, setSelectedGenre,
    selectedYear, setSelectedYear,
    searchMovies,
    filteredResults,
    searchedQuery 
  };
}