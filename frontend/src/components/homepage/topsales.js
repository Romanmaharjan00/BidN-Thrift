import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { publicRequest } from "../../requestMethods";

const Topsales = ({ title }) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () =>{
    publicRequest.get(`product/?sold=0`)
    .then(res => {
      setProducts(res?.data)
    }).catch(error => {
      // Handle error
      console.error("Error getting product:", error);
  })
  }
  return (
    <>
      <div className="m-auto flex justify-center items-center py-10 bg-gray-100">
        <div className="responsive-width flex flex-col gap-4 ">
          <h1 className="text-3xl font-medium">{title}</h1>
          <div className="grid grid-cols-3 gap-4">
            {
              products?.slice(0, 3)?.map(product => {
                return <ProductCard product={product} />
              })
            }
          </div>
          <div className="flex justify-end w-full">
            <a className="bg-[#3A3B48] px-10 py-2 text-white rounded-md" href='/shop/All'>
              Shop More
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topsales;
