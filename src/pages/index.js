import Card from "@/components/home/Card";
import CarouselComponent from "@/components/home/Carousel";
// import cardData from "../store/cardData.json"
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { baseURL } from "@/utils/baseURL";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ data }) {
  // console.log(props.data)

  let categories = new Set();
  const [typeFilter, setTypeFilter] = useState(false);
  const foodData = [];
  const handleData = () => {
    data?.map((data) => {
      return foodData.push(data), categories.add(data.category);
    });
  };
  handleData();
  let categoryArray = [...categories];
  return (
    <>
      <Head>
        <title>Pizza Mania</title>
      </Head>
      <div className="bg-white dark:bg-black">
        <CarouselComponent />
        <div className="container mx-auto">
          <div className="my-6 space-x-5">
            <button
              className={`border-black rounded-full dark:border-white hover:bg-slate-600 border-2 py-1 px-3 text-black dark:text-white ${
                !typeFilter && "bg-slate-300 dark:bg-slate-600"
              } `}
              onClick={() => setTypeFilter(false)}
            >
              All
            </button>
            <button
              className={`border-black rounded-full dark:border-white hover:bg-slate-600 border-2 py-1 px-3 text-black dark:text-white ${
                typeFilter === "Veg" && "bg-slate-300 dark:bg-slate-600"
              } `}
              onClick={() => {
                setTypeFilter("Veg");
              }}
            >
              <span
                className={
                  "lowercase font-thin bg-white border-green-500 border mr-2 px-0.1 text-green-500"
                }
              >
                ●
              </span>
              Veg
            </button>
            <button
              className={`border-black rounded-full dark:border-white hover:bg-slate-600 border-2 py-1 px-3 text-black dark:text-white ${
                typeFilter === "Non-Veg" && "bg-slate-300 dark:bg-slate-600"
              } `}
              onClick={() => {
                setTypeFilter("Non-Veg");
              }}
            >
              <span
                className={
                  "lowercase font-thin bg-white border-red-500 border mr-2 px-0.1 text-red-500"
                }
              >
                ●
              </span>
              Non Veg
            </button>
          </div>
          {categoryArray.map((category) => {
            return (
              <>
                <div
                  key={category}
                  className="text-4xl mt-10 mb-3 uppercase font-bold text-black dark:text-white"
                >
                  {category}
                </div>
                <hr className="text-black dark:text-white" />
                <div className="flex flex-col items-center justify-center">
                  <div
                    key={category}
                    className="grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {foodData
                      ?.filter((foodData) => category === foodData.category)
                      ?.filter((foodData) =>
                        typeFilter ? typeFilter === foodData.foodType : foodData
                      )
                      ?.map((data) => {
                        return <Card key={data.name} foodData={data} />;
                      })}
                  </div>
                </div>
              </>
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
    if (!Array.isArray(data)) {
      console.error("Expected array but got:", data);
    }
  } catch (error) {
    console.log(error.message);
  }

  return {
    props: {
      data: data || null,
    },
  };
}
