"use client"
import { Badge, Button, Dialog, DialogPanel, Select, SelectItem } from "@tremor/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function MovieList() {
    const [movies, setMovies] = useState<any[]>([]);
    const [moviesGenres, setMoviesGenres] = useState<any[]>([])
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number>(10)
    const [selectedSortBy, setSelectedSortBy] = useState<string>("popularity");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [order, setOrder] = useState(".desc")

    const fetchMovies = async (page: any) => {
        setLoading(true);
        const genreQuery = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(",").replace(/,/g, "%2C")}` : "";
        const ratingQuery = selectedRatings !== 10 ? `&vote_average.lte=${selectedRatings}` : "";
        const sortby = `&sort_by=${selectedSortBy}`;
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
                `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}${sortby}${order}${genreQuery}${ratingQuery}`,
                options
            );

            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                setMovies(data.results);
                setTotalPages(data.total_pages);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error("Error fetching popular movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMovieDetails = async (id: any) => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzNkYTMyMGQ5YzI2NGY4ZTVhNGUzOWU3OWUzMGI0ZiIsInN1YiI6IjY1YzM4Mjg3OGUyZTAwMDE4M2E2NWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oaPQ58y_zz3Z54mqC-glrs4Rd__8Jhp1BEL6eYJMW7o",
            },
        };
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=credits&language=en-US`, options)

            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                setSelectedMovie(data)
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error("Error fetching movies detail:", error);
        }
    };

    const fetchMoviesGenres = async () => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzNkYTMyMGQ5YzI2NGY4ZTVhNGUzOWU3OWUzMGI0ZiIsInN1YiI6IjY1YzM4Mjg3OGUyZTAwMDE4M2E2NWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oaPQ58y_zz3Z54mqC-glrs4Rd__8Jhp1BEL6eYJMW7o",
            },
        };
        try {
            const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)

            if (response.ok) {
                const data = await response.json();
                // console.log("genres: ", data);
                setMoviesGenres(data.genres);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error("Error fetching movies genres:", error);
        }
    };

    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage, selectedGenres, selectedRatings, selectedSortBy, order]);

    useEffect(() => {
        fetchMoviesGenres()
    }, [])

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleGenreChange = (genreId: number) => {
        setSelectedGenres((prevGenres) => {
            if (prevGenres.includes(genreId)) {
                return prevGenres.filter((id) => id !== genreId);
            } else {
                return [...prevGenres, genreId];
            }
        });
        setCurrentPage(1);
        // console.log(selectedGenres)
    };

    const handleRatingChange = (rating: number) => {
        setSelectedRatings(rating);
        setCurrentPage(1);
        // console.log(rating);
    };

    const handleSortByChange = (value: string) => {
        setSelectedSortBy(value);
        setCurrentPage(1);
    };

    const imageLoader = ({ src }: { src: any }) => {
        return src;
    }
    return (
        <>
            <div className="flex flex-row gap-5 justify-center">
                <div className="border-2 p-2 hidden md:inline">
                    <p className=" font-bold text-lg mb-1">FILTER BY</p>
                    <p className=" font-semibold">Genres</p>
                    {moviesGenres.map((genre) => (
                        <label key={genre.id} className="flex items-center">
                            <input
                                type="checkbox"
                                value={genre.id}
                                checked={selectedGenres.includes(genre.id)}
                                onChange={() => handleGenreChange(genre.id)}
                                className="mr-2"
                            />
                            {genre.name}
                        </label>
                    ))}
                    <p className=" font-semibold mt-1">Ratings</p>
                    <div className="flex flex-col gap-1">
                        {[...Array(10)].map((_, index) => (
                            <label key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={index + 1}
                                    checked={index + 1 === selectedRatings}
                                    onChange={() => handleRatingChange(index + 1)}
                                    className="mr-1"
                                />
                                {Array.from({ length: index + 1 }, (_, starIndex) => (
                                    <i key={starIndex}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-yellow-500">
                                            <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
                                        </svg>

                                    </i>
                                ))}
                            </label>
                        )).reverse()}
                    </div>
                </div>
                <div className="flex-1">
                    <div className=" w-full mb-2 flex gap-1 items-center md:justify-end justify-between">
                        {/* mobile view filter */}
                        <Button className="md:hidden" onClick={() => setIsFilterOpen(true)} variant="secondary" size="xs" color="sky">Filter By</Button>
                        <Dialog open={isFilterOpen} onClose={(val) => setIsFilterOpen(val)} static={true}>
                            <DialogPanel>
                                <div className="w-full flex justify-end">
                                    <i onClick={() => setIsFilterOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-red-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </i>
                                </div>
                                <div >
                                    <p className="font-bold text-lg mb-1">FILTER BY</p>
                                    {/* Your filter options go here */}
                                    <p className="font-semibold">Genres</p>
                                    <div className="grid grid-cols-2">
                                        {moviesGenres.map((genre) => (
                                            <label key={genre.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={genre.id}
                                                    checked={selectedGenres.includes(genre.id)}
                                                    onChange={() => handleGenreChange(genre.id)}
                                                    className="mr-2"
                                                />
                                                {genre.name}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="font-semibold mt-1">Ratings</p>
                                    <div className="grid grid-cols-2 gap-1">
                                        {[...Array(10)].map((_, index) => (
                                            <label key={index} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={index + 1}
                                                    checked={index + 1 === selectedRatings}
                                                    onChange={() => handleRatingChange(index + 1)}
                                                    className="mr-1"
                                                />
                                                {index + 1}
                                                <i >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-yellow-500">
                                                        <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
                                                    </svg>
                                                </i>
                                            </label>
                                        )).reverse()}
                                    </div>
                                </div>
                                {/* <div className="mt-3 text-right">
                                    <Button variant="light" onClick={() => setIsFilterOpen(false)}>
                                        Close
                                    </Button>
                                </div> */}
                            </DialogPanel>
                        </Dialog>
                        <div className="flex items-center gap-1">
                            {/* <p className=" font-bold">Sort By</p> */}
                            <div>
                                <Select value={selectedSortBy} onValueChange={(value: string) => handleSortByChange(value)} >
                                    <SelectItem value="popularity">Popularity</SelectItem>
                                    <SelectItem value="original_title">Title</SelectItem>
                                    <SelectItem value="release_date">Release Date</SelectItem>
                                    <SelectItem value="vote_average">Rating</SelectItem>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-1 mx-2">
                                <span title="Sort ascending">
                                    <i onClick={() => setOrder(".asc")} className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className={`w-4 h-4 m-0 p-0 hover:text-gray-600 ${order === ".asc" ? 'text-gray-900' : ' text-gray-400'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                        </svg>
                                    </i>
                                </span>
                                <span title="Sort descending">
                                    <i onClick={() => setOrder(".desc")} className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className={`w-4 h-4 m-0 p-0 hover:text-gray-600 ${order === ".desc" ? 'text-gray-900' : ' text-gray-400'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                        </svg>
                                    </i>
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center my-10 h-full">
                            <BeatLoader
                                color="#7dd3fc" loading={true}
                            />
                        </div>
                    ) : (
                        <>
                            {movies.length === 0 ? (
                                <div className="flex justify-center my-10 h-full">
                                    <p>No movies found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-fit">
                                    {movies.map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="shadow-md border p-2 hover:scale-105 hover:md:scale-110 transform transition duration-300 relative"
                                            onClick={() => fetchMovieDetails(movie.id)}
                                        >
                                            <Badge className={`absolute -top-2 text-black right-0 ${movie.vote_average >= 7 ? 'bg-green-400' : movie.vote_average >= 5 ? 'bg-yellow-400' : 'bg-red-400'}`}>
                                                {`${(movie?.vote_average * 10).toFixed(0)}%`}
                                            </Badge>
                                            <div className="">
                                                <Image
                                                    loader={imageLoader}
                                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                    alt={movie.title}
                                                    width={500}
                                                    height={300}
                                                    layout="responsive"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <p className="text-lg font-bold">{movie.title}</p>
                                            <p>Release Date: {movie.release_date}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selectedMovie && (
                                <Dialog open={true} onClose={() => setSelectedMovie(null)} static={true} >
                                    <DialogPanel className=" md:min-w-[90%]" >
                                        <div className="w-full flex justify-end">
                                            <i onClick={() => setSelectedMovie(null)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-red-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </i>
                                        </div>
                                        <div className="p-4 pt-0 rounded-lg md:grid md:grid-cols-2">
                                            <div>
                                                <h2 className="text-lg font-bold">{selectedMovie.title}</h2>
                                                <p className="mt-1 font-medium">Release Date:
                                                    <span className="font-normal inline-block ml-1">
                                                        {selectedMovie.release_date}
                                                    </span>
                                                </p>
                                                <p className="mt-1 font-medium">Synopsis:
                                                    <span className=" font-normal block">
                                                        {selectedMovie.overview}
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mt-1 font-medium">Cast:</p>
                                                <ul className="grid grid-cols-2 gap-4">
                                                    {selectedMovie.credits?.cast.slice(0, 10).map((castMember: any) => (
                                                        <li key={castMember.id} className="flex items-center mb-2">
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w200${castMember.profile_path}`}
                                                                alt={castMember.name}
                                                                className=" w-14 h-14 mr-2 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <p className="font-semibold">{castMember.name}</p>
                                                                <p className="text-sm">{castMember.character}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                    {selectedMovie.credits?.cast.length > 10 && <li>and more...</li>}
                                                </ul>
                                            </div>
                                        </div>

                                    </DialogPanel>
                                </Dialog>
                            )}
                        </>
                    )}
                </div>

            </div>
            <div className=" mt-6 flex justify-center gap-3 items-center">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Previous Page
                </button>
                <p className="text-center">Page {currentPage} of {totalPages}</p>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Next Page
                </button>
            </div>
        </>
    )
}
