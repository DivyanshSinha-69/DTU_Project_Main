import React from "react";
import homebg from "../../assets/dtu3.png";
import Carousal from "./Carousal";
const Home = () => {
  return (
    <div className="bg-gray-700">
      <div
        className="p-4 h-screen flex justify-center items-center text-center font-mono"
        style={{
          backgroundImage: `url(${homebg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="font1 tracking-widest sm:text-lg md:text-3xl lg:text-6xl text-white font-bold">
          DTU ECE PORTAL
        </p>
      </div>
      <div className="w-[100%] p-12 pt-24 text-white font1">
        <div className="w-[100%]  ">
          <div className=" w-[50%] ml-auto text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde illum
            architecto, tempore molestiae recusandae impedit porro minima fugit
            repellat, quam possimus eveniet. Officiis, iusto fugiat. Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Itaque, quasi.
            Corrupti placeat, reiciendis in odit nostrum velit quae ipsam ab!
            Obcaecati minima laudantium fugiat quibusdam?
          </div>
        </div>

        <div className="w-[100%] ">
          <div className=" w-[50%] p-6 text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde illum
            architecto, tempore molestiae recusandae impedit porro minima fugit
            repellat, quam possimus eveniet. Officiis, iusto fugiat. Lorem ipsum
            dolor sit amet consectetur, adipisicing elit. Expedita ratione
            impedit delectus, dolores libero mollitia facilis commodi sunt quas
            quisquam! Molestias dolore impedit expedita dolor.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-80 md:h-96 lg:h-screen ">
        <div className="w-4/5">
          <Carousal />
        </div>
      </div>
      <div className="w-[100%] p-12 pt-0 text-white font1 ">
        <div className="w-[100%] ">
          <div className=" w-[50%] p-6 text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde illum
            architecto, tempore molestiae recusandae impedit porro minima fugit
            repellat, quam possimus eveniet. Officiis, iusto fugiat.lorem25
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            impedit nihil aut quae laborum voluptates cumque quaerat autem
            assumenda aperiam facilis, expedita, harum, iure numquam!
          </div>
        </div>
        <div className="w-[100%] ">
          <div className=" w-[50%] ml-auto text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde illum
            architecto, tempore molestiae recusandae impedit porro minima fugit
            repellat, quam possimus eveniet. Officiis, iusto fugiat. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Velit doloribus
            quibusdam, incidunt rerum modi voluptatum laudantium, rem sit
            tempore repellat repudiandae, ab laboriosam blanditiis delectus.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
