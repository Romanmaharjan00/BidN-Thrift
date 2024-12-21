import React from "react";
import Navbar from "../common/navbar";
import Carousel from "./carousel";
import Aboutus from "./aboutus";
import Topsales from "./topsales";
import Footer from "./Footer";
import Testimonials from "./Testimonials";

const Home = () => {
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Carousel />
          <Aboutus />
          <Topsales title="Latest Products" />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
