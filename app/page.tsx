"use client";
import Header from "@/components/header";
import MovieList from "@/components/movielist";

export default function Home() {
  return (
    <>
      <Header />
      <div className=" p-2 ">
        <MovieList />
      </div>
    </>
  );
}
