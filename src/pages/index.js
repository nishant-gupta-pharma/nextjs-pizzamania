import { useEffect, useState } from "react";
import Head from "next/head";
import Card from "@/components/home/Card";
import CarouselComponent from "@/components/home/Carousel";
import { baseURL } from "@/utils/baseURL";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ data }) {
  const [typeFilter, setTypeFilter] = useState(false);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setName(storedName);
  }, []);

  const categories = new Set();
  const foodData = [];
  data?.forEach((item) => {
    foodData.push(item);
    categories.add(item.category);
  });
  const categoryArray = [...categories];

  return (
    <>
      <Head>
        <title>Pizza Mania</title>
      </Head>
      <div className="bg-white dark:bg-black">
        <CarouselComponent />
        <div className="container mx-auto">
          <div className="text-black dark:text-white px-0.1 text-xl flex mt-2 items-center justify-center">
            <i>
              Welcome <b>{name}!</b>
            </i>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between my-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`border-black rounded-full dark:border-white hover:bg-slate-600 border-2 py-1 px-3 text-black dark:text-white ${
                  !typeFilter && "bg-slate-300 dark:bg-slate-600"
                }`}
                onClick={() => setTypeFilter(false)}
              >
                All
              </button>
              <button
                className={`border-black rounded-full dark:border-white hover:bg-slate-600 border-2 py-1 px-3 text-black dark:text-white ${
                  typeFilter === "Veg" && "bg-slate-300 dark:bg-slate-600"
                }`}
                onClick={() => setTypeFilter("Veg")}
              >
                <span className="lowercase font-thin bg-white border-green-500 border mr-2 px-0.5 text-green-500">
                  ●
                </span>
                Veg
              </button>
              <button
                className={`border-black rounded-full dark:border-white hover:bg-slate-600 border-2 py-1 px-3 text-black dark:text-white ${
                  typeFilter === "Non-Veg" && "bg-slate-300 dark:bg-slate-600"
                }`}
                onClick={() => setTypeFilter("Non-Veg")}
              >
                <span className="lowercase font-thin bg-white border-red-500 border mr-2 px-0.5 text-red-500">
                  ●
                </span>
                Non Veg
              </button>
            </div>

            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search food item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-black dark:border-white rounded-full w-full md:w-[300px] border-2 py-1 px-3 text-black dark:text-white"
              />
            </div>
          </div>

          {categoryArray.map((category, index) => {
            const filteredItems = foodData
              .filter((item) => item.category === category)
              .filter((item) =>
                typeFilter ? item.foodType === typeFilter : true
              )
              .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              );

            return (
              <div key={index}>
                <div className="text-4xl mt-10 mb-3 uppercase font-bold text-black dark:text-white">
                  {category}
                </div>
                <hr className="text-black dark:text-white mb-4" />
                <div className="flex flex-col items-center justify-center">
                  {filteredItems.length > 0 ? (
                    <div className="grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredItems.map((data) => (
                        <Card key={data._id} foodData={data} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 italic p-10">
                      No items found
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let data;
  try {
    const pizzaData = await fetch(baseURL + "api/foodData", { method: "GET" })
      .then((response) => response.json())
      .catch((error) => error.message);

    data = await JSON.parse(JSON.stringify(pizzaData));
  } catch (error) {
    console.log(error.message);
  }

  return {
    props: {
      data: data || null,
    },
  };
}
