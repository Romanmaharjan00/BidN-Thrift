import React, { useEffect, useState } from "react";
import Navbar from "../common/navbar";
import { Link, useLocation } from "react-router-dom";
import { publicRequest } from "../../requestMethods";
import Footer from "../homepage/Footer";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { updateValue } from '../../reddux/cart/cartslicer'


const ShopCart = () => {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.pathname?.split("/")[2];
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selfDetail, setselfDetail] = useState([]);

  useEffect(() => {
    // fetchproduct();
    checkOut();
    checkproduct()
  }, []);

  const checkproduct = () => {
    publicRequest
      .get(`user/cart`)
      .then((res) => {
        const soldProduct = res?.data?.filter((product) => {
          return product?.productId?.sold === 1
        })
        soldProduct?.map((sold_product) => {
          removeProduct(sold_product, false)
        })
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      })
      .finally(() => { fetchproduct() })
  };
  const fetchproduct = () => {
    publicRequest
      .get(`user/cart`)
      .then((res) => {
        setProducts(res?.data);
        dispatch(updateValue(res?.data?.length))
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  };

  const removeProduct = (product, showNotification = true) => {
    const prodId = product._id;

    publicRequest
      .delete(`user/delete-product-cart/${prodId}`)
      .then((res) => {
        setCart(res?.data);
        fetchproduct();
        showNotification && enqueueSnackbar("Product removed from cart", { variant: "error" });
      })
      .catch((error) => {
        console.error("Error removing from cart:", error);
      });
  };

  const checkOut = () => {
    publicRequest
      .get(`user/selfuser`)
      .then((res) => {
        setselfDetail(res?.data);
      })
      .catch((error) => {
        console.error("Error checking out:", error);
      });

  }

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://thriftbids-backend.onrender.com";


  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="font-medium justify-center text-center pt-4 pb-8 text-2xl tracking-widest bg-gray-200">
          <p>Shopping Cart</p>
        </div>
        {/* <>{JSON.stringify(selfDetail?._id)}</> */}

        <div className="bg-gray-100 p-10 flex-grow">
          <div className="responsive-width justify-center items-center m-auto ">
            {products?.map(
              (product) =>
              (
                <div
                  to={`/productpage/${product?.productId._id}`}
                  className="flex p-10 justify-center items-center bg-white rounded-md shadow-md mb-3 mt-3 "
                  key={product._id}
                >
                  <img
                    src={
                      product?.productId?.images
                        ? `${baseUrl}${product?.productId?.images}`
                        : "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
                    }
                    alt="Product Image"
                    className="w-1/4 rounded-md object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/productpage/${product?.productId._id}`);
                    }}
                  />
                  <div className="flex flex-col gap-2 items-start ml-4">
                    <p className="text-2xl font-semibold">
                      {product?.productId?.title}
                    </p>
                    <p className="text-base pt-1">
                      {product?.productId?.description}
                      <p className="text-lg font-bold">
                        ${product?.productId?.price}
                      </p>
                      <p className="text-gray-600">
                        {/* Category: {product?.productId?.category} */}
                      </p>
                    </p>

                    <div className="flex flex-row gap-3 mt-2">
                      <button
                        className="bg-white px-6 py-2 text-red-500 rounded-md"
                        onClick={() => removeProduct(product, true)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="flex flex-row justify-end items-end m-auto">
              <button className={` bg-[#3A3B48] px-12 py-2 text-white rounded-md ${products.length < 1 && "hidden"}`}
                onClick={() => navigate(`/checkout/${selfDetail?._id}`)}>
                Checkout
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ShopCart;
{
  /* <button
onClick={() => buynow()}
className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
>
buy now
</button> */
}
