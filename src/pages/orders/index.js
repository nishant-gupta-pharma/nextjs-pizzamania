import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Orders() {
  const [ordersData, setOrdersData] = useState([]);
  const fetchData = async () => {
    await fetch("api/myOrdersData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("userEmail") }),
    }).then(async (res) => {
      let response = await res.json();
      setOrdersData(response?.order_data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {ordersData.length > 0 ? (
        <>
          <div className="bg-white dark:bg-black">
            <div className="container mx-auto">
              {ordersData?.[0]?.order_data?.map((orderGroup, index) => (
                <div key={index}>
                  {orderGroup.map((item, idx) =>
                    item.order_date ? (
                      <div key={idx} className="py-5">
                        <strong className="text-black dark:text-white text-2xl">
                          {index + 1}: {item.order_date}
                        </strong>
                        <hr className="text-black dark:text-white" />
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="mt-3 w-80 rounded-lg border-gradient"
                      >
                        <div className="relative w-full rounded-lg h-82">
                          <Image
                            src={item.img}
                            alt={item.name}
                            objectFit="cover"
                            layout="fill"
                            className="rounded-lg"
                          />
                        </div>
                        <div className="px-2 text-black dark:text-white font-bold text-lg">
                          <u>{item.name}</u>
                        </div>
                        <div className="px-2 py-1 flex justify-between items-center">
                          {[
                            { label: "Qty", value: item.qty },
                            { label: "Size", value: item.size },
                            { label: "Price", value: `${item.price}.0` },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className="font-semibold text-black dark:text-white"
                            >
                              <i>
                                {label}: {value}
                              </i>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-screen flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold"> No previous Orders 😅</h1>
          {/* <p className="text-gray-600 mt-4">No previous Orders 😅</p> */}
          <Link
            href="/"
            className="text-violet-500 text-xl hover:font-bold mt-8"
          >
            Go back to home
          </Link>
        </div>
      )}
    </>
  );
}

export default Orders;
