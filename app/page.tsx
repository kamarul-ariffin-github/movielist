import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <div className=" p-2 flex flex-row gap-5">
        <div className="border-2 p-2">
          <p>FILTER BY</p>
          <p>Genres</p>
          <p>Ratings</p>
        </div>
        <div className="flex flex-1 flex-row flex-wrap gap-3">
          <div className=" shadow-md border p-2 hover:scale-110 transform transition duration-300">
            <p className=" px-6 py-10">Image</p>
            <p>Title</p>
            <p>Release date</p>
          </div>
          <div className=" shadow-md border p-2 hover:scale-110 transform transition duration-300">
            <p className=" px-6 py-10">Image</p>
            <p>Title</p>
            <p>Release date</p>
          </div>
        </div>
      </div>
    </>
  );
}
