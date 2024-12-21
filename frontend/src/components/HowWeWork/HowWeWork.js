import React from "react";
import Navbar from "../common/navbar";
import Footer from "../homepage/Footer";

const HowWeWork = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center bg-gray-200 py-10">
        <div className="flex responsive-width flex-col justify-center items-center text-center gap-2">
          <p className="font-medium text-3xl">How we work</p>
          <p className="text-xl mb-6"></p>

          <div className="text-xl">
            <p className="text-lg font-normal mb-8">
              <p className="italic !font-medium !text-xl">
                1. Collection of Clothes:{" "}
              </p>
              <br></br>In the first step of our process, we actively source
              high-quality thrifted clothing items. Our dedicated team
              collaborates with various channels to curate a diverse and unique
              collection. We emphasize selecting items that align with current
              fashion trends, ensuring our platform offers an appealing array of
              pre-loved fashion choices.
            </p>

            <p className="text-lg font-normal mb-8">
              <p className="italic !font-medium !text-xl"> 2. Listing:</p>
              <br></br> Once we've meticulously curated our thrifted clothing
              collection, the next step is listing these items on our platform.
              Our sellers, who are passionate individuals keen on promoting
              sustainability, play a crucial role here. They provide detailed
              descriptions, including the condition, brand, and any unique
              features of the items. High-quality images are also included to
              give buyers a comprehensive view of each piece, fostering
              transparency and confidence in the buying process.
            </p>

            <p className="text-lg font-normal mb-8">
              <p className="italic !font-medium !text-xl"> 3. Payment: </p>
              <br></br>When buyers find their perfect thrifted item, the payment
              process is designed to be secure and straightforward. After adding
              desired items to their cart, users can proceed to a seamless
              checkout experience. We integrate with a secure payment gateway,
              such as Khalti, to ensure the confidentiality of payment details.
              Once the order is confirmed, buyers receive a detailed summary,
              and sellers are notified to initiate the shipping process. This
              streamlined payment process enhances the overall user experience,
              making sustainable and stylish fashion just a few clicks away.
            </p>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HowWeWork;
