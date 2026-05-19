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
    selectedYear, setSelectedYear, selectMovieById, modalLoading, results, searchedQuery,
    searchPage, searchTotalPages, dbTotalResults, dbPage, dbTotalPages, setDbPage, 
    dbAllYears, dbAllGenres
  } = useMovies();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Movie Catalog System</h1>

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
          My Rated Movies {dbLoading ? "(Loading...)" : `(${dbTotalResults})`}
        </button>
      </div>

      {activeTab === "search" ? (
        <div>
          <SearchBar 
            query={query} setQuery={setQuery} onSearch={() => searchMovies(1)}
            selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
            selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          />

          {loading && <div className="text-center text-gray-400 mb-6 animate-pulse">Loading movies...</div>}

          {results.length > 0 && filteredResults.length === 0 && !loading ? (
            <div className="text-center text-gray-500 text-lg mt-12 py-8 bg-gray-900/20 rounded-xl max-w-xl mx-auto border border-dashed border-gray-800">
              <p>No movies match your selected filters</p>
              <p className="text-sm text-gray-600 mt-1">Try adjusting your genre or release year selectors.</p>
            </div>
          ) : results.length === 0 && !loading && searchedQuery ? (
            <div className="text-center text-gray-500 text-lg mt-12 py-8 bg-gray-900/20 rounded-xl max-w-xl mx-auto border border-dashed border-gray-800">
              <p>No movies found matching "{searchedQuery}"</p>
              <p className="text-sm text-gray-600 mt-1">Try checking your spelling or searching for another title.</p>
            </div>
          ) : (
            <div>
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

              {searchTotalPages > 1 && (
                <div className="flex flex-col items-center justify-center space-y-2 mt-12 pt-6 border-t border-gray-900">
                  <div className="text-sm h-5">
                    {loading ? (
                      <span className="text-blue-400 font-medium animate-pulse">
                        Loading page {searchPage}...
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Page <strong className="text-white">{searchPage}</strong> of <strong className="text-white">{searchTotalPages}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      disabled={searchPage === 1 || loading}
                      onClick={() => searchMovies(searchPage - 1)}
                      className="w-40 py-2 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold text-white cursor-pointer flex items-center justify-center"
                    >
                      Previous Page
                    </button>

                    <button
                      disabled={searchPage === searchTotalPages || loading}
                      onClick={() => searchMovies(searchPage + 1)}
                      className="w-40 py-2 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold text-white cursor-pointer flex items-center justify-center"
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <RatedMoviesTab 
          dbRatedMovies={dbRatedMovies}
          filteredDatabaseMovies={filteredDatabaseMovies}
          userRatings={userRatings}
          setActiveTab={setActiveTab}
          selectMovieById={selectMovieById}
          ratedSearchQuery={ratedSearchQuery}
          setRatedSearchQuery={setRatedSearchQuery}
          ratedScoreFilter={ratedScoreFilter}
          setRatedScoreFilter={setRatedScoreFilter}
          ratedSelectedGenre={ratedSelectedGenre}
          setRatedSelectedGenre={setRatedSelectedGenre}
          ratedSelectedYear={ratedSelectedYear}
          setRatedSelectedYear={setRatedSelectedYear}
          dbAllYears={dbAllYears}
          dbAllGenres={dbAllGenres}
          dbPage={dbPage}
          dbTotalPages={dbTotalPages}
          setDbPage={setDbPage}
        />
      )}

      {selectedMovie && (
        <MovieModal 
          movie={{
            ...selectedMovie,
            overview: selectedMovie.overview || 
                      (selectedMovie as any).description || 
                      (selectedMovie as any).synopsis || 
                      "No overview available.",
            
            vote_average: typeof selectedMovie.vote_average === 'number' ? selectedMovie.vote_average : (
                          (selectedMovie as any).voteAverage || 
                          (selectedMovie as any).rating || 
                          (selectedMovie as any).tmdbRating || 
                          0
                        )
          }} 
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