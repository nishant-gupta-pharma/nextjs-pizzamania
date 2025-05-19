import Image from "next/image"
import Link from "next/link"
import React from "react"

function Footer() {
  return (
    <footer className="text-white-100 bg-gradient-to-r from-indigo-700 via-violet-700 to-orange-700 body-font">
      <div className=" container mx-auto text-white flex flex-wrap p-3 flex-col md:flex-row items-center">
        <Link
          href={"/"}
          className="flex title-font font-extrabold items-center  uppercase text-gray-100"
        >
          <Image
            alt="Navbar Logo"
            src={"/PizzaMania.svg"}
            width={40}
            height={40}
          />
          <p className="leading-5 text-2xl mx-2">Pizza Mania</p>
        </Link>
        <p className="text-sm text-gray-100 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          Copyright © 2025 Pizza Mania
        </p>
      </div>
    </footer>
  )
}

export default Footer
