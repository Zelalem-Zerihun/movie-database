/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import Pagination from "./components/Pagination";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState("movie");

  const fetchMovies = async (searchQuery, page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}&page=${page}&type=movie`
      );
      if (response.data.Response === "True") {
        setMovies(response.data.Search);
        setTotalResults(parseInt(response.data.totalResults));
        setError("");
      } else {
        setError(response.data.Error || "No movies found.");
        setMovies([]);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = (searchQuery) => {
    setQuery(searchQuery);
    setPageNumber(1);
    fetchMovies(searchQuery, 1);
  };

  const handleHome = () => {
    setQuery("movie");
    setPageNumber(1);
    fetchMovies("movie", 1);
  };

  const handlePrevious = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPageNumber((prev) => prev + 1);
  };

  useEffect(() => {
    fetchMovies(query, pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    fetchMovies("movie", 1);
  }, []);

  const fetchMovieDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      setSelectedMovie(response.data);
    } catch (err) {
      setError("Error fetching movie details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-gray-100 p-4 text-black">
      <div className="h-full flex flex-col w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center flex-1">
            Movie Database
          </h1>
          <button
            onClick={handleHome}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Home
          </button>
        </div>
        <div className="max-w-md mx-auto mb-8 w-full px-4">
          <SearchBar onSearch={searchMovies} />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex-grow w-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-80 z-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          )}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full ${
              isLoading ? "opacity-0" : ""
            }`}
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={fetchMovieDetails}
              />
            ))}
          </div>

          {/* Pagination Component */}
          {totalResults > 0 && (
            <Pagination
              pageNumber={pageNumber}
              totalResults={totalResults}
              onPrevious={handlePrevious}
              onNext={handleNext}
              loading={isLoading}
            />
          )}
        </div>
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
