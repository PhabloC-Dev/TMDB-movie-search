import { useState } from "react";
import { type Movie } from "../types";
import { API_BASE_URL } from "../config";

<<<<<<< HEAD
=======
//Everything related to the TMDB API search tab.

>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
export function useSearchCatalog() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
<<<<<<< HEAD
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);

  // Trigger search when query OR page changes
  const searchMovies = async (pageNumber: number = 1) => {
    if (!query) return;
    setLoading(true);
    setSearchPage(pageNumber);
    try {
      // 👇 Pass the page number to your backend /search endpoint
      const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${pageNumber}`);
      if (!res.ok) {
        console.error('Search request failed:', res.status, res.statusText);
        setResults([]);
        setSearchTotalPages(1);
        return;
      }
      const data = await res.json();

      setResults(data.results || []);
      setSearchTotalPages(data.total_pages || 1);
      setSearchedQuery(query);
=======

  const searchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/search?q=${query}`);
      const data = await res.json();
      setResults(data.results || []);
      setSearchedQuery(query); 
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
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
<<<<<<< HEAD
    searchedQuery,
    // 👇 Expose these to App.tsx
    searchPage,
    searchTotalPages,
    setSearchPage
=======
    searchedQuery 
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
  };
}