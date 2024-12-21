import React, { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import Navbar from '../common/navbar';
import Footer from '../homepage/Footer';
import { Link, useLocation } from "react-router-dom";


const CheckOutSucess = () => {
    const location = useLocation();
    const id = location?.pathname?.split("/")[3];

    const [orderDetails, setorderDetails] = useState([]);

    useEffect(() => {
        updateOrderDetails()
    }, []);

    const baseUrl =
        process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : "https://thriftbids-backend.onrender.com";


    const updateOrderDetails = () => {
        publicRequest
            .put(`/user/update/${id}`, { paymentStatus: 1 })
            .then((res) => {
                getOrderDetails()
                publicRequest.delete('user/empty-cart').then((res) => {
                    console.log("empitied cart")
                 })
                .catch((error) => {
                    console.error("Error emptying cart", error);
                });

            })
            .catch((error) => {
                console.error("Error getting order details", error);
            });
    };

    const getOrderDetails = () => {
        publicRequest
            .get(`/user/order/${id}`)
            .then((res) => {
                res?.data?.order?.orderItems?.map(orderItem => {
                    updateProductStatus(orderItem?.product?._id)
                })
            })
            .catch((error) => {
                console.error("Error getting order details", error);
            })
            .finally(() => {
                publicRequest
                    .get(`/user/order/${id}`)
                    .then((res) => {
                        setorderDetails(res?.data)
                    })
                    .catch((error) => {
                        console.error("Error getting order details", error);
                    })
            })
    };


    const updateProductStatus = (product_id) => {
        publicRequest.put(`/product/${product_id}`, { sold: 1 })
            .then((res) => {
            })
            .catch((error) => {
                console.error("Error getting order details", error);
            });
    };

    return (
        <>
            <div>
                <Navbar />
                <div className="font-medium justify-center text-center pt-8 pb-8 text-2xl tracking-widest bg-gray-200">
                    <h1>Order Confirmation Page</h1>
                </div>
                <div className="flex flex-row container mx-auto my-8 p-8 border rounded shadow-md responsive-width">

                    <div className='flex flex-col w-full m-2 pl-4 gap-2 ' >
                        <h1 className="flex text-2xl font-semibold mb-8">Your order given below has been sucessfully created you can check your dashboard for status</h1>
                        {console.log("order details: ", orderDetails?.order?.orderItems)}
                        {orderDetails?.order?.orderItems?.map((product) =>
                            <div><div className='flex flex-col overflow-y-auto gap-4' style={{ maxHeight: '420px' }}>
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        {/* {JSON.stringify(product?.product)} */}

                                        <img
                                            src={
                                                product?.product?.images
                                                    ? `${baseUrl}${product?.product?.images}`
                                                    : "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
                                            }
                                            alt="Product Image"
                                            className="w-1/4 flex flex-row rounded-md object-cover"
                                        />


                                        <div className="flex flex-col gap-2 ml-4 pt-2">
                                            <p className="text-xl font-semibold">
                                                {product?.product?.title}
                                            </p>
                                            <p className="text-base pt-1">
                                                {product?.product?.description}

                                            </p>
                                            <p className="text-lg font-bold">
                                                Rs {product?.product?.price}
                                            </p>

                                        </div>


                                    </div>


                                </div>
                            </div> </div>
                        )}
                        {/* <>{JSON.stringify(orderDetails?.order?.totalprice)}</> */}

                        <div>
                            <p className='text-2xl font-bold pt-4'>   Grand Total: Rs {orderDetails?.order?.totalprice}  </p>

                        </div>

                    </div>

                </div>
            </div >
            <Footer />
        </>
    );
}

export default CheckOutSucess;