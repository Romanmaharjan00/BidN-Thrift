import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#3A3B48] text-white py-16 px-40 flex justify-center items-center">
      <div className="responsive-width">
        <div className="w-full flex justify-between items-start gap-10 ">
          <div>
            <p className="text-4xl">BidNthrifT</p>
            <p>Where your dreams come true!</p>
          </div>
          <div className="flex flex-col">
            <p className="text-4xl">Sitemap:</p>

            <a href='/'>Home</a>
            <a href='/aboutus'>About Us</a>
            <a href='/shop/All'>Shop</a>
            <a href='/biddingshop/All'>Bidding Shop</a>
            <a href='/how-we-work'>How we work</a>
            <a href='/termsandconditions'>Terms & Conditions</a>
          </div>
          <div>
            <p className="text-4xl">Contact Us</p>
            <p>Lets Connect!</p>
            <p>bidnthrift09@gmail.com</p>
            <p>+977-976-797-9319</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
