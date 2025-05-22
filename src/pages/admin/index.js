import React, { useEffect, useState } from "react";
import Custom404 from "../404";

const sidesPriceOption = { single: "", double: "" };
const pizzaPriceOption = { regular: "", medium: "", large: "" };
function Admin() {
  const [mounted, setMounted] = useState(false);
  const [foodList, setFoodList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  const [foodData, setFoodData] = useState({
    name: "",
    foodCategory: "",
    foodType: "",
    price: "",
    description: "",
    img: "",
  });
  const handleChange = (e) => {
    setFoodData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
    if (e.target.name === "foodCategory") {
      if (e.target.value === "Pizzas") {
        setFoodData((prevData) => {
          return { ...prevData, price: pizzaPriceOption };
        });
      } else if (e.target.value === "SIDES & BEVERAGES") {
        setFoodData((prevData) => {
          return { ...prevData, price: sidesPriceOption };
        });
      } else {
        setFoodData((prevData) => {
          return { ...prevData, price: e.target.value };
        });
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("api/createFoodData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData),
    });
    const result = await response.json();
    if (result.success) {
      alert("Food data created successfully");

      setFoodData({
        name: "",
        foodCategory: "",
        foodType: "",
        price: "",
        description: "",
        img: "",
      });
    } else {
      alert("Failed to create");
    }
  };
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    const response = await fetch(`/api/deleteFoodData?id=${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      alert("Food item deleted successfully");

      // Remove from state
      setFoodList((prev) => prev.filter((item) => item._id !== id));
    } else {
      alert("Error: " + result.message);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/foodData");
      const data = await res.json();
      setFoodList(data);
    }

    fetchData();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("isAdmin")) === true) {
      setMounted(true);
    }
  }, []);

  return (
    <>
      {mounted ? (
        <>
          <div
            style={{
              minHeight: "90vh",
              backgroundImage:
                'url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
              backgroundSize: "cover",
            }}
            className=" flex py-10 justify-center content-center items-center flex-col"
          >
            <div className="flex justify-center space-x-4 py-6">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded cursor-pointer ${
                  activeTab === "create"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                }`}
              >
                Add New Item
              </button>
              <button
                onClick={() => setActiveTab("delete")}
                className={`px-4 py-2 rounded cursor-pointer ${
                  activeTab === "delete"
                    ? "bg-red-600 text-white"
                    : "bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                }`}
              >
                Delete Existing Item
              </button>
            </div>
            {activeTab === "create" ? (
              <div className=" container w-full max-w-md">
                <form
                  onSubmit={handleSubmit}
                  className="bg-gray-100 dark:bg-gray-900 dark:text-gray-100 border-gradient rounded-lg shadow-2xl px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Food Name
                    </label>
                    <input
                      placeholder="Food name"
                      name="name"
                      onChange={handleChange}
                      type="text"
                      required
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 focus:border-indigo-700 text-gray-700 dark:text-gray-100  leading-tight focus:outline-none focus:shadow-outline"
                      value={foodData.name}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="foodCategory"
                      className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Food Category
                    </label>
                    <select
                      placeholder="Food Category"
                      name="foodCategory"
                      onChange={handleChange}
                      type="foodCategory"
                      required
                      style={{ "-webkit-appearance": "auto" }}
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 dark:bg-gray-900 focus:border-indigo-700 text-gray-700 dark:text-gray-100  leading-tight focus:outline-none focus:shadow-outline"
                      value={foodData.foodCategory}
                    >
                      <option value="">Select Food Category</option>
                      <option value="Pizzas">PIZZAS</option>
                      <option value="SIDES & BEVERAGES">
                        SIDES & BEVERAGES
                      </option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="foodType"
                      className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Food Type
                    </label>
                    <select
                      onChange={handleChange}
                      name="foodType"
                      required
                      style={{ "-webkit-appearance": "auto" }}
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 dark:bg-gray-900 focus:border-indigo-700 text-gray-700 dark:text-gray-100  leading-tight focus:outline-none focus:shadow-outline"
                      value={foodData.foodType}
                    >
                      <option value="">Select food type</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>

                  {foodData.foodCategory !== "" && (
                    <div className="mb-4">
                      <label
                        htmlFor="geolocation"
                        className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                      >
                        Food Price
                      </label>
                      {foodData.price !== "" &&
                        Object.keys(foodData.price).map((key) => {
                          return (
                            <div key={key} className="ml-4 mb-4">
                              <label
                                className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                                htmlFor={key}
                              >
                                {key}
                              </label>
                              <input
                                key={key}
                                type="number"
                                name={key}
                                placeholder={`Price for ${key}`}
                                value={foodData?.price[key]}
                                onChange={(e) => {
                                  setFoodData({
                                    ...foodData,
                                    price: {
                                      ...foodData.price,
                                      [key]: e.target.value,
                                    },
                                  });
                                }}
                                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 focus:border-indigo-700 text-gray-700 dark:text-gray-100  leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                          );
                        })}
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Description"
                      name="description"
                      onChange={handleChange}
                      type="text"
                      required
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 focus:border-indigo-700 text-gray-700 dark:text-gray-100  leading-tight focus:outline-none focus:shadow-outline"
                      value={foodData.description}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="img"
                      className="block text-gray-700  dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Food Image
                    </label>
                    <input
                      placeholder="Image URL"
                      name="img"
                      onChange={handleChange}
                      type="url"
                      required
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 focus:border-indigo-700 text-gray-700 dark:text-gray-100  leading-tight focus:outline-none focus:shadow-outline"
                      value={foodData.img}
                    />
                  </div>
                  <div className="flex items-center justify-between"></div>
                  <button
                    type="submit"
                    className="border font-bold text-gray-900 dark:text-gray-100 dark:border-gray-400 border-gray-900 rounded p-2 mr-2 hover:bg-gradient-to-r from-indigo-700 via-violet-700 to-orange-700  hover:text-gray-100"
                  >
                    Create
                  </button>
                </form>
              </div>
            ) : activeTab === "delete" ? (
              <div className=" container w-full border-gradient max-w-lg ">
                <div
                  style={{ maxHeight: "65vh" }}
                  className="bg-gray-100 dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-2xl px-8 pt-4 overflow-y-scroll scrollbar-hide"
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white text-black text-center">
                    Food Items
                  </h2>
                  <div className="mb-6 max-w-md">
                    <input
                      type="text"
                      placeholder="Search food items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 text-black dark:text-white dark:border-gray-600"
                    />
                  </div>

                  {[...new Set(foodList.map((item) => item.category))].map(
                    (category) => {
                      const filteredItems = foodList
                        .filter((item) => item.category === category)
                        .filter((item) =>
                          item.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        );

                      if (filteredItems.length === 0) return null;

                      return (
                        <div
                          key={category}
                          className="mb-8 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800"
                        >
                          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-t-xl">
                            <h3 className="text-xl font-bold tracking-wide text-gray-800 dark:text-white flex items-center gap-2">
                              🍽️ {category === "Pizzas" ? "PIZZAS" : category}
                            </h3>
                          </div>

                          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
                            {filteredItems.map((item) => (
                              <li
                                key={item._id}
                                className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                              >
                                <span className="text-gray-900 dark:text-white font-medium ml-4">
                                  {item.name}
                                </span>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                                  title="Delete item"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <Custom404 />
      )}
    </>
  );
}

export default Admin;

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
