import React, { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import Navbar from '../common/navbar';
import Footer from '../homepage/Footer';
import { useForm } from "react-hook-form";
import { useNavigate, Redirect, Route } from 'react-router-dom';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const CheckOut = () => {
    const [responseMessage, setResponseMessage] = useState(false);

    const schema = yup
        .object({
            name: yup.string().required("Full name is required"),
            email: yup.string().required("Email address is required"),
            address: yup.string().required("Full address is required"),
            city: yup.string().required("City is required"),
            phone: yup.number().test('len', 'Phone must be at least 10 digits', val => String(val).length >= 10).typeError("Phone number cannot be empty").required("Phone number is required"),
            other: yup.string().required("Additional comment or write none"),
            pincode: yup.number().min(1,"Provide a valid pincode").required("Pincode is required"),
        })
        .required();

    const [products, setProducts] = useState([]);

    const { register, handleSubmit, watch, formState: { errors }, } = useForm({
        // defaultValues: { ...data },
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        fetchproduct();
    }, []);

    const fetchproduct = () => {
        publicRequest
            .get(`user/cart`)
            .then((res) => {
                setProducts(res?.data);
            })
            .catch((error) => {
                console.error("Error fetching cart:", error);
            });
    };

    const baseUrl =
        process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : "https://thriftbids-backend.onrender.com";

    const website_url =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3001"
            : "https://thriftbids.vercel.app";

    const calculateTotalPrice = () => {
        const totalPrice = products.reduce((total, product) => total + product?.productId?.price, 0);
        return totalPrice.toFixed(2);
    };

    let navigate = useNavigate();

    const onSubmit = (data) => {
        const convertedArray = products.map(obj => ({
            product: obj.productId._id,
            price: obj.productId.price
        }));

        // console.log("check",convertedArray);

        const obj = { shippingInfo: { phone: parseInt(data.phone), pincode: parseInt(data.pincode), ...data }, orderItems: convertedArray, totalprice: parseFloat(calculateTotalPrice()) }

        console.log("check", obj);
        publicRequest.post("user/cart/create-order", obj)

            .then(res => {
                setResponseMessage(false);
                const purchase_order_id = res?.data?.order?._id
                const return_url = website_url + "/checkout/sucess/" + purchase_order_id
                const khaltiObject = {
                    return_url,
                    website_url,
                    amount: parseFloat(calculateTotalPrice())*100,
                    purchase_order_id,
                    purchase_order_name: purchase_order_id,
                }
                console.log("amount as done:",Math.round(parseFloat(calculateTotalPrice())*100));

                console.log("check", res?.data?.order?.shippingInfo?.paymentMethod);
                console.log("khaltiobject", khaltiObject);

                if (res?.data?.sucess && res?.data?.order?.shippingInfo?.paymentMethod === "cashOnDelivery") {
                    window.location.href = website_url + "/checkout/sucess/" + purchase_order_id;
                }
                else if (res?.data?.sucess && res?.data?.order?.shippingInfo?.paymentMethod === "khalti") {
                    publicRequest.post("product/khalti-api", khaltiObject)
                        .then(khaltiRes => {
                            console.log('khaltiRes: ', khaltiRes?.data?.data?.payment_url);
                            if (khaltiRes?.data?.success) {
                                const updatedPidObject = {
                                    paymentOrderId: {
                                        PIdx: khaltiRes?.data?.data?.pidx
                                    }
                                }
                                publicRequest.put(`user/update/${purchase_order_id}`, updatedPidObject)
                                    .then(updateResponse => {
                                        console.log('updateResponse: ', updateResponse?.status);
                                        if (updateResponse?.status) {
                                            window.location.href = khaltiRes?.data?.data?.payment_url
                                        }
                                    }).catch(updateErr => {
                                        console.log('updateErr: ', updateErr);
                                        setResponseMessage("There is update error: "+ updateErr?.response?.data?.message);
                                    })
                            }
                        }).catch(khaltiErr => {
                            console.log('khaltiErr: ', khaltiErr?.response?.data?.message);
                            setResponseMessage("There is khalti error: " + khaltiErr?.response?.data?.message);
                        })
                }
            }).catch(err => {
                setResponseMessage("the error is:"+ err?.response?.data?.message);
                console.log('err: ', err);
            })
    }
    return (
        <>
            <div>
                <Navbar />
                <div className="font-medium justify-center text-center pt-8 pb-8 text-2xl tracking-widest bg-gray-200">
                    <h1>Checkout Page</h1>
                </div>
                <div className="flex flex-row container mx-auto my-8 p-8 border rounded shadow-md responsive-width">

                    <div className='flex flex-col w-full m-2'>
                        <h1 className="flex text-2xl font-semibold mb-8">Shipping details</h1>
                        <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                            {/* User Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input {...register("name")} type="text" name="name" className="mt-1 p-2 w-full border rounded" />
                                    <span className="text-red-500 text-sm">
                                        {errors.name?.message}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input {...register("email")} name="email" className="mt-1 p-2 w-full border rounded" type="email" />
                                    <span className="text-red-500 text-sm">
                                        {errors.email?.message}
                                    </span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input {...register("address")} type="text" name="address" className="mt-1 p-2 w-full border rounded" />
                                <span className="text-red-500 text-sm">
                                    {errors.address?.message}
                                </span>
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input {...register("city")} type="text" name="city" className="mt-1 p-2 w-full border rounded" />
                                    <span className="text-red-500 text-sm">
                                        {errors.city?.message}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input {...register("phone")} type="number" name="phone" className="mt-1 p-2 w-full border rounded" defaultValue={0}/>
                                    <span className="text-red-500 text-sm">
                                        {errors.phone?.message}
                                    </span>
                                </div>
                            </div>

                            {/* Other Information */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Other</label>
                                <input {...register("other")} type="text" name="other" className="mt-1 p-2 w-full border rounded" />
                                <span className="text-red-500 text-sm">
                                    {errors.other?.message}
                                </span>
                            </div>

                            {/* Pincode */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input {...register("pincode")} type="number" name="pincode" className="mt-1 p-2 w-full border rounded" defaultValue={0}/>
                                <span className="text-red-500 text-sm">
                                    {errors.pincode?.message}
                                </span>
                            </div>



                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select {...register("paymentMethod")} className="mt-1 p-2 w-full border rounded">
                                    <option value="khalti">Khalti</option>
                                    <option value="cashOnDelivery">Cash on Delivery</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <p className="text-red-400">{responseMessage}</p>
                            <div className="mt-8">
                                <button type="submit" className="bg-[#3A3B48] px-10 py-2 text-white rounded-md">
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className='flex flex-col w-full m-2 pl-4 gap-2 ' >
                        <h1 className="flex text-2xl font-semibold mb-8">Order details</h1>

                        {products?.map((product) =>


                            <div className='flex flex-col overflow-y-auto gap-4' style={{ maxHeight: '420px' }}>
                                <div className="flex flex-col">
                                    <div className="flex flex-row">

                                        <img
                                            src={
                                                product?.productId?.images
                                                    ? `${baseUrl}${product?.productId?.images}`
                                                    : "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
                                            }
                                            alt="Product Image"
                                            className="w-1/4 flex flex-row rounded-md object-cover"
                                        />


                                        <div className="flex flex-col gap-2 ml-4 pt-2">
                                            <p className="text-xl font-semibold">
                                                {product?.productId?.title}
                                            </p>
                                            <p className="text-base pt-1">
                                                {product?.productId?.description}

                                            </p>
                                            <p className="text-lg font-bold">
                                                Rs {product?.productId?.price}
                                            </p>

                                            {/* <div className="flex">
                                            <button className="bg-white  text-red-500">
                                                Remove
                                            </button>
                                        </div> */}
                                        </div>


                                    </div>


                                </div>
                            </div>
                        )}
                        <div>
                            <p className='text-2xl font-bold pt-4'>   Grand Total: Rs {calculateTotalPrice()}  </p>
                            {/* <>{JSON.stringify(products)}</> */}
                        </div>

                    </div>

                </div>
            </div >
            <Footer />
        </>
    );
}

export default CheckOut;