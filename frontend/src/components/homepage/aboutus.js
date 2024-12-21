import React from "react";
import "./aboutus.css";
import aboutusImg from "./aboutusimg.jpg"

const Aboutus = () => {
  return (
    <>
      <div className="flex p-10 justify-center items-center ">
        <div className="flex responsive-width justify-between items-center">
          <div className="w-1/2 flex flex-col items-start gap-2">
            <p className="text-3xl font-medium">About Us</p>
            <p className="text-lg pb-2">Who we are</p>
            <p className="pb-3">
            At our core, we are a team driven by a mission to make a positive impact
            on the environment and promote conscious consumer choices We invite you to
            join us on this journey towards a more sustainable and eco-friendly fashion 
            industry.
              
            </p>
            <a className="bg-[#3A3B48] px-10 py-2 text-white rounded-md" href='/aboutus'>
              Read More
            </a>
          </div>
          <img
            src={aboutusImg}
            alt="About Us Image"
            className="w-1/4 "
          />
        </div>
      </div>
    </>
  );
};

export default Aboutus;
