"use client";
import Header from "@/components/header";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = async (page: any) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzNkYTMyMGQ5YzI2NGY4ZTVhNGUzOWU3OWUzMGI0ZiIsInN1YiI6IjY1YzM4Mjg3OGUyZTAwMDE4M2E2NWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oaPQ58y_zz3Z54mqC-glrs4Rd__8Jhp1BEL6eYJMW7o",
      },
    };
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
        options
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Header />
      <div className=" p-2 ">
        <div className="flex flex-row gap-5">
          <div className="border-2 p-2">
            <p>FILTER BY</p>
            <p>Genres</p>
            <p>Ratings</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="shadow-md border p-2 hover:scale-110 transform transition duration-300"
              >
                <div className="bg-red-100 relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-60 object-fill"
                  />
                </div>
                <p className="text-lg font-bold">{movie.title}</p>
                <p>Release Date: {movie.release_date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous Page
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next Page
          </button>
        </div>
      </div>
    </>
  );
}
