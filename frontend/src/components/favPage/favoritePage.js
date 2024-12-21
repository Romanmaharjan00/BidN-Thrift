import React, { useEffect, useState } from "react";
import Navbar from "../common/navbar";
import { publicRequest } from "../../requestMethods";
import Footer from "../homepage/Footer";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateValue } from "../../reddux/cart/cartslicer";

const FavoritePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchproduct();
    fetchCartProduct();
  }, []);

  const fetchproduct = () => {
    publicRequest
      .get(`user/wishlist`)
      .then((res) => {
        setProducts(res?.data);
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  };

  const fetchCartProduct = () => {
    publicRequest
      .get(`user/cart`)
      .then((res) => {
        setCart(res?.data);
        dispatch(updateValue(res?.data?.length));
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding to wishlist:", error);
      });
  };

  const onSubmit = (product) => {
    const prodId = product._id;

    publicRequest
      .put(`product/wishlist`, { prodId })
      .then((res) => {
        setWishlist(res?.data);
        fetchproduct();
        enqueueSnackbar("Product has been removed from favourites", {
          variant: "error",
        });
      })
      .catch((error) => {
        console.error("Error removing from wishlist:", error);
      });
  };

  const onSubmitCart = (product) => {
    const productId = product._id;
    const carts = cart?.find((a) => a?.productId?._id === productId);
    
    carts
      ? publicRequest
          .delete(`user/delete-product-cart/${carts?._id}`, { productId })
          .then((res) => {
            // setWishlist(res?.data);
            fetchCartProduct();
            enqueueSnackbar("Product Removed From Cart", { variant: "error" });
          })
          .catch((error) => {
            console.error("Error removing from wishlist:", error);
          })
      : publicRequest
          .post(`user/cart`, { productId })
          .then((res) => {
            setWishlist(res?.data);
            fetchCartProduct();
            enqueueSnackbar("Product Added To Cart", { variant: "success" });
          })
          .catch((error) => {
            console.error("Error removing from wishlist:", error);
          });
  };
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://thriftbids-backend.onrender.com";
  // Image path from the database

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="font-medium justify-center text-center pt-8 pb-8 text-2xl tracking-widest bg-gray-200">
          <h1>Your Favorite Items</h1>
        </div>
        <div className="bg-gray-100 flex-grow">
          {products?.wishlist?.map(
            (product) =>
              product?.sold === 0 && (
                <div
                  to={`/productpage/${product._id}`}
                  className="flex p-10 justify-center items-center"
                  key={product._id}
                >
                  <div className="flex w-full md:w-3/4 lg:w-1/2 xl:w-1/3 bg-white rounded-md shadow-md">
                    <img
                      src={
                        product?.images
                          ? `${baseUrl}${product?.images}`
                          : "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
                      }
                      alt="Product Image"
                      className="w-1/3 md:w-1/4 rounded-l-md object-cover cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productpage/${product._id}`);
                      }}
                    />
                    <div className="w-2/3 md:w-3/4 p-4">
                      <p className="text-2xl font-semibold mb-2">
                        {product.title}
                      </p>
                      <p className="text-lg font-bold pt-3">${product.price}</p>
                      <p className="text-gray-600 mb-4">
                        Category: {product.category}
                      </p>

                      <div className="flex flex-row gap-4">
                        {/* {JSON.stringify(product)} */}
                        <button
                          className="bg-[#3A3B48] px-10 py-2 text-white ml-4 rounded-md"
                          onClick={() => {
                            onSubmitCart(product);
                          }}
                        >
                          {/* {JSON.stringify(cart?.find((a) => a?.productId?._id === product?._id))} */}
                          {cart?.find((a) => a?.productId?._id === product?._id)
                            ? "Added to cart"
                            : "Add to cart"}
                        </button>
                        <button
                          className="bg-white px-10 py-2 text-red-500 ml-4 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSubmit(product);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FavoritePage;
