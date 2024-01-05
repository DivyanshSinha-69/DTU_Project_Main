import React from "react";
import homebg from "../../assets/dtu3.png";
import homebg1 from "../../assets/dtu2.png";
import homebg2 from "../../assets/dtu.png";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";


const Carousal = () => {
  return (
    <Carousel 
    autoPlay 
    infiniteLoop 
    interval={1000} 
    showStatus={false}
    showThumbs={false} 
    showArrows={false}>
      <div>
        <img src={homebg1} className='rounded-xl'/>
      </div>
      <div>
        <img src={homebg2} className='rounded-xl'/>
      </div>
      <div>
        <img src={homebg} className='rounded-xl'/>
      </div>
    </Carousel>
  );
};

export default Carousal;
