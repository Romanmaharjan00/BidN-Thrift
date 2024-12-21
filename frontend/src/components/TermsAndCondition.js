import React from "react";
import Navbar from "./common/navbar";
import Footer from "./homepage/Footer";

const TermsAndCondition = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <Navbar />
        <div className="bg-gray-200 p-8 flex-grow ">
          <div className="container mx-auto text-center responsive-width">
            <h1 className="text-3xl font-medium mb-4">
              Our Terms And Conditions
            </h1>
            <p className="flex flex-col text-black text-lg font-normal gap-2">
              <p>
                1) All transactions done through the website is final and
                there is no refund.
              </p>
              <p>
                2) Users are prohibited from engaging in any unlawful,
                fraudulent, or abusive activities on our platform. This includes
                but is not limited to spamming, hacking, or distributing
                malware. Your account can be banned or deleted from the
                platform, if you are found involved in such activities.
              </p>
              <p>
                3) All transactions done through the website will encur a
                VAT or TAX amount, added to the product price after checkout.
              </p>
              <p>
              4) Shipping times may vary depending on the destination and
                shipping method selected. We are not responsible for any delays
                or issues encountered during the shipping process.
              </p>
              <p>
                5) Users are responsible for maintaining the security of their
                accounts and passwords. Any unauthorized use of accounts or
                breach of security must be reported immediately.
              </p>
              <p>
                6) We provide our platform on an "as is" and "as available"
                basis, without any warranties or representations, expressed or
                implied. We do not guarantee that our platform will be
                uninterrupted, secure, or error-free.
              </p>
              <p>
                7) We strive to provide accurate and detailed product
                descriptions; however, we do not guarantee the accuracy,
                completeness, or reliability of any product information.
              </p>
              <p>
                8) These terms and conditions shall be governed by and construed
                in accordance with the laws of Nepal, and any disputes shall be
                subject to the exclusive jurisdiction of the courts in Nepal.
              </p>
            </p>

            
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TermsAndCondition;
