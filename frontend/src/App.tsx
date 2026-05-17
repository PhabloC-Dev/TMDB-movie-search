import { useMovies } from "./hooks/useMovies";
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { SearchBar } from './components/SearchBar';
import { RatedMoviesTab } from './components/RatedMoviesTab';

function App() {
  const {
    query, setQuery, loading, activeTab, setActiveTab, dbLoading, userRatings,
    selectedMovie, setSelectedMovie, dbRatedMovies, filteredResults, filteredDatabaseMovies,
    searchMovies, handleRateMovie, ratedSearchQuery, setRatedSearchQuery,
    ratedScoreFilter, setRatedScoreFilter, ratedSelectedGenre, setRatedSelectedGenre,
    ratedSelectedYear, setRatedSelectedYear, selectedGenre, setSelectedGenre,
    selectedYear, setSelectedYear, selectMovieById, modalLoading, results, searchedQuery
  } = useMovies();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Movie Catalog System</h1>

      {/* --- NAVIGATION BAR TABS --- */}
      <div className="flex justify-center space-x-6 mb-8 border-b border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab("search")}
          className={`w-56 cursor-pointer text-lg font-bold px-4 py-2 rounded-md transition-colors ${
            activeTab === "search" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Search Catalog
        </button>
        <button
          onClick={() => setActiveTab("rated")}
          className={`w-56 cursor-pointer text-lg font-bold px-4 py-2 rounded-md transition-colors ${
            activeTab === "rated" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          My Rated Movies {dbLoading ? "(Loading...)" : `(${dbRatedMovies.length})`}
        </button>
      </div>

      {/* --- TAB CONTENT SWITCHER --- */}
      {activeTab === "search" ? (
        <div>
          <SearchBar 
            query={query} setQuery={setQuery} onSearch={searchMovies}
            selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
            selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          />

          {loading && <div className="text-center text-gray-400 mb-6 animate-pulse">Loading movies...</div>}

          {results.length > 0 && filteredResults.length === 0 && !loading ? (
            /* Case 1: Search succeeded, but filters hid all cards */
            <div className="text-center text-gray-500 text-lg mt-12 py-8 bg-gray-900/20 rounded-xl max-w-xl mx-auto border border-dashed border-gray-800">
              <p>No movies match your selected filters</p>
              <p className="text-sm text-gray-600 mt-1">Try adjusting your genre or release year selectors.</p>
            </div>
          ) : results.length === 0 && !loading && searchedQuery ? (
            /* Case 2: The submitted query returned absolutely nothing from the API */
            <div className="text-center text-gray-500 text-lg mt-12 py-8 bg-gray-900/20 rounded-xl max-w-xl mx-auto border border-dashed border-gray-800">
              <p>No movies found matching "{searchedQuery}"</p>
              <p className="text-sm text-gray-600 mt-1">Try checking your spelling or searching for another title.</p>
            </div>
          ) : (
            /* Case 3: Grid displays naturally or remains blank when typing */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredResults.map((movie) => (
                <div key={movie.id} className="cursor-pointer">
                  <MovieCard 
                    movie={movie} 
                    onClick={() => selectMovieById(movie)} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (

        <RatedMoviesTab 
          dbRatedMovies={dbRatedMovies}
          filteredDatabaseMovies={filteredDatabaseMovies}
          userRatings={userRatings}
          setActiveTab={setActiveTab}
          setSelectedMovie={setSelectedMovie}
          ratedSearchQuery={ratedSearchQuery}
          setRatedSearchQuery={setRatedSearchQuery}
          ratedScoreFilter={ratedScoreFilter}
          setRatedScoreFilter={setRatedScoreFilter}
          ratedSelectedGenre={ratedSelectedGenre}
          setRatedSelectedGenre={setRatedSelectedGenre}
          ratedSelectedYear={ratedSelectedYear}
          setRatedSelectedYear={setRatedSelectedYear}
        />
      )}

      {/* --- MOVIE MODAL CONTAINER --- */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          userRatings={userRatings} 
          onClose={() => setSelectedMovie(null)} 
          onRate={handleRateMovie}
          isLoading={modalLoading}
        />
      )}
    </div>
  );
}

export default App;