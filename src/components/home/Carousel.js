/* eslint-disable @next/next/no-img-element */
import React from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const imageProp = [
  "https://media.istockphoto.com/id/187248625/photo/pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=QHrM65XqDQd3Z50r5cT2qV4nwctw6rNMM1JTlGEEVzI=",
  "https://media.istockphoto.com/id/501767010/photo/chocolate-banana-smoothie-with-coconut-milk.jpg?s=612x612&w=0&k=20&c=r892DoLum3hAdZfkQH6jBVgzihY2_De5TEhkiXdDrR4=",
  "https://media.istockphoto.com/id/1216463471/photo/close-up-of-fast-food-snacks.jpg?s=612x612&w=0&k=20&c=-_nBOUgVgFVT4Mxmlzii1EaAQ587P5lCcr1-UVfZukY=",
]
function CarouselComponent() {
  return (
    <Carousel
      autoPlay
      navButtonsAlwaysVisible
      infiniteLoop
      showStatus={false}
      emulateTouch
      showThumbs={false}
    >
      {imageProp.map((image, index) => {
        return (
          <div
            key={index}
            style={{ maxHeight: "36rem" }}
            className="object-center brightness-50"
          >
            <img src={image} alt="pizza" className="object-fit" />
          </div>
        )
      })}
    </Carousel>
  )
}

export default CarouselComponent
