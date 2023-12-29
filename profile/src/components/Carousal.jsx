import React from "react";
import homebg from "../assets/dtu3.png";
import homebg1 from "../assets/dtu2.png";
import homebg2 from "../assets/dtu.png";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";


const Carousal = () => {
  return (
    <Carousel
    showThumbs={false}
    autoPlay
    interval={1000}
    >
      <div>
        <img src={homebg1} />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src={homebg2} />
        <p className="legend">Legend 2</p>
      </div>
      <div>
        <img src={homebg} />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
};

export default Carousal;
