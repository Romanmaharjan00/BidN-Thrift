import React from "react";
import Navbar from "../common/navbar";
import Footer from "../homepage/Footer";

import aboutus1 from "./aboutus1.jpg";
import aboutus2 from "./aboutus2.jpg";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-200 p-8 flex-grow ">
        <div className="container mx-auto text-center responsive-width">
          <h1 className="text-3xl font-medium mb-4">About Us</h1>
          <p className="text-black mb-8 text-lg">
            Welcome to our thrifted clothing marketplace! We are passionate
            about sustainable fashion and believe in giving pre-loved items a
            new life.
          </p>
          <div className="flex justify-center mb-8">
            <img src={aboutus1} alt="Image 1" className="w-1/2 h-auto mr-4" />
            <img src={aboutus2} alt="Image 2" className="w-1/2 h-auto" />
          </div>
          <p className="text-black text-lg">
            Our mission is to create a community that values and celebrates the
            uniqueness of thrifted clothing.
            <p></p>Join us in reducing clothing waste and promoting sustainable
            fashion choices!!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
