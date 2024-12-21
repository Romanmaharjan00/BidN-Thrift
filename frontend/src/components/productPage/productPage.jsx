import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { publicRequest } from "../../requestMethods";
import Navbar from "../common/navbar";
import Footer from "../homepage/Footer";
import Topsales from "../homepage/topsales";
import BidForm from "./bidForm";
import { Countdown } from "./countDown";
import Biddinglist from './biddinglist';
import { enqueueSnackbar } from 'notistack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector, useDispatch } from 'react-redux'
import { updateValue } from '../../reddux/cart/cartslicer'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    
    boxShadow: 24,
    p: 4,
};
const styleBidd = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    
    boxShadow: 24,
    p: 4,
};


const Productpage = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const id = location?.pathname?.split("/")[2];
    const [products, setProducts] = useState([]);
    console.log('products: ', products);
    const [expiryData, setExpiryData] = useState();
    console.log('expiryData: ', expiryData);
    const [wishlist, setWishlist] = useState([]);

    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : 'https://thriftbids-backend.onrender.com';

        
    // Image path from the database
    const imagePath = products?.images;
    const imageUrl = `${baseUrl}${imagePath}`;

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = new Date(products?.expiry_date) - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        fetchproduct()
        fetchmaxproduct()
        fetchUserWishList()
        fetchCartProduct()
    }, [id, timeLeft]);

    const fetchproduct = () => {
        publicRequest.get(`product/${id}`)
            .then(res => {
                setProducts(res?.data)
            }).catch(error => {
                // Handle error
                console.error("Error getting products:", error);
            });
    }
    const [cart, setCart] = useState([]);
    console.log('cart: ', cart?.find((a => a?.productId?._id === products?._id)));
    const fetchCartProduct = () => {
        publicRequest.get(`user/cart`)
            .then(res => {
                setCart(res?.data)
                dispatch(updateValue(res?.data?.length))
            }).catch(error => {
                // Handle error
                console.error("Error getting cart:", error);
            });
    }
    const fetchmaxproduct = () => {
        publicRequest.get(`product/checkExpiryForBid/${id}`)
            .then(res => {
                console.log('res: ', res);
                setExpiryData(res)
            }).catch(error => {
                // Handle error
                console.error("Error checking for expiry bid:", error);
            });
    }

    const [wishListsss, setWishListsss] = useState([]);
    const fetchUserWishList = () => {
        publicRequest
            .get(`user/wishlist`)
            .then((res) => {
                setWishListsss(res?.data);
            })
            .catch((error) => {
                console.error("Error fetching wishlist:", error);
            });
    }

    const onSubmitCart = (product) => {
        const productId = product._id;
        const carts = cart?.find((a => a?.productId?._id === products?._id))

        carts
            ? publicRequest.delete(`user/delete-product-cart/${carts._id}`, { productId })
                .then(res => {
                    // setWishlist(res?.data);
                    fetchCartProduct()
                    enqueueSnackbar("Product Removed From Cart",{ variant: 'error' })

                })
                .catch(error => {
                    console.error("Error removing from Cart:", error);
                })
            : publicRequest.post(`user/cart`, { productId })
                .then(res => {
                    setWishlist(res?.data);
                    fetchCartProduct()
                    enqueueSnackbar("Product Added To Cart",{ variant: 'success' })
                })
                .catch(error => {
                    console.error("Error removing from Cart:", error);
                })

    };
    const onSubmitWishlist = (product) => {
        const prodId = product?._id; // Assuming _id is the product id field

        publicRequest.put(`product/wishlist`, { prodId })
            .then(res => {
                setWishlist(res?.data);
                fetchUserWishList()
                enqueueSnackbar(
                    wishListsss?.wishlist?.find(wish => wish._id === products?._id)
                    ? { message: "Product Successfully Removed From Favourite", variant: 'error' }
                    : { message: "Product Successfully Added To Favourite", variant: 'success' }
                );
            })
            .catch(error => {
                // Handle error
                console.error("Error adding to Favourite:", error);
            });
    };

    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const isTokenAvailable = localStorage.getItem("token");


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [products?.expiry_date]);

    return (
        <>
            <Navbar />

            <div className="flex flex-row p-11 justify-center items-center gap-4 bg-white pt-5 pb-5">
                {/* <>{JSON.stringify(imageUrl)}</> */}
                <img
                    src={
                        products?.images && products.images.length > 0
                            ? imageUrl
                            : "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"}
                    alt="Product Image"
                    className="w-96 !aspect-square object-cover" />

                <div className="flex flex-row gap-4">
                    <div className="justify-center mt-1">
                        <div>
                            {
                                products.sold && products?.bidding
                                    ?
                                    <div>
                                        <p className="font-normal text-5xl pl-4">{products?.title}</p>
                                        <p className="font-bold text-2xl pl-4 pt-5">Final Bid was {products?.top_bid}</p>
                                        <p className="w-[486px] top-[163px] left-[27px] font-normal text-lg pl-4 pt-1">{products?.description}</p>

                                        <p className="font-normal text-xl pl-4 pt-2 italic">***Bidding is over in this product***</p>
                                        <p className="font-normal text-xl pl-4 pt-2">This product was won by: {products?.top_bidder?.firstname}</p>
                                    </div>


                                    : <>
                                        {
                                            products.sold
                                                ? <div>
                                                    <p className="font-normal text-5xl pl-4">{products?.title}</p>
                                                    <p className="font-bold text-2xl pl-4 pt-5">Rs {products?.price}</p>
                                                    <p className="w-[486px] top-[163px] left-[27px] font-normal text-lg pl-4 pt-1">{products?.description}</p>

                                                    <p className="font-normal text-xl pl-4 pt-4 italic">***This product is already sold***</p>
                                                </div>

                                                : <>{products?.bidding ?
                                                    <>
                                                        <>
                                                            <p className="font-normal text-5xl pl-4">{products?.title}</p>
                                                            <div className='font-bold text-2xl pl-4 pt-5'>
                                                                {
                                                                    Object.keys(timeLeft).length !== 0
                                                                        ? products?.bidder_info?.length > 0 ?
                                                                            <>Current bid: Rs {JSON.stringify(Math.max(...products?.bidder_info?.map(info => info?.bidding_price)) || 0)}</>
                                                                            :
                                                                            <>Current bid: Rs {products?.price}</>
                                                                        :
                                                                        <></>

                                                                }
                                                            </div>
                                                            <p className="w-[486px] top-[163px] left-[27px] font-normal text-lg pl-4 pt-1">{products?.description}</p>
                                                            <Countdown endDate={products?.expiry_date} />
                                                            <div className='flex flex-row gap-5 justify-between pt-2'>

                                                                <div className=' pt-3'>{
                                                                    Object.keys(timeLeft).length !== 0
                                                                        ? isTokenAvailable ?
                                                                            <button className="bg-[#3A3B48] px-10 py-2 text-white ml-4 rounded-md" onClick={handleOpen}>Place a bid </button> : <button className="bg-[#3A3B48] px-10 py-2 text-white ml-4"><a href='/login'>Place a bid</a></button>
                                                                        :
                                                                        <></>

                                                                }</div>

                                                                <div className='pl-1 pt-4'>
                                                                    {
                                                                        Object.keys(timeLeft).length !== 0 && <> <button className='pl-1 px-4 text-sky-400' onClick={() => setOpenModal(true)}>Bidding History</button></>
                                                                    }
                                                                </div>

                                                                <Modal
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="modal-modal-title"
                                                                    aria-describedby="modal-modal-description"
                                                                >
                                                                    <Box sx={style}>
                                                                        <BidForm products={products} handleClose={handleClose} fetchproduct={fetchproduct} />
                                                                    </Box>
                                                                </Modal>

                                                                <Modal
                                                                    open={openModal}
                                                                    onClose={() => { setOpenModal(false) }}
                                                                    aria-labelledby="modal-modal-title-bidd"
                                                                    aria-describedby="modal-modal-description-bidd"
                                                                >
                                                                    <Box sx={styleBidd}>
                                                                        <Biddinglist />
                                                                    </Box>
                                                                </Modal>
                                                            </div>
                                                        </>
                                                    </>
                                                    : <>
                                                        <div className='flex flex-col'>
                                                            <div className="ml-auto pb-3">
                                                                {
                                                                    isTokenAvailable
                                                                        ?
                                                                        <button
                                                                            type="submit"
                                                                            className="py-2 text-black ml-4"
                                                                            onClick={() => onSubmitWishlist(products)}
                                                                        >

                                                                            {wishListsss?.wishlist?.find(wish => wish._id === products?._id) ? <FavoriteIcon /> : <HeartBrokenIcon />}
                                                                        </button>
                                                                        :
                                                                        <Link
                                                                            type="submit"
                                                                            className="py-2 text-black ml-4"
                                                                            to="/login"
                                                                        >
                                                                            {wishListsss?.wishlist?.find(wish => wish._id === products?._id) ? <FavoriteIcon /> : <HeartBrokenIcon />}
                                                                        </Link>
                                                                }
                                                            </div>
                                                        </div>

                                                        <p className="font-normal text-5xl pl-4">{products?.title}</p>
                                                        <p className="font-bold text-2xl pl-4 pt-5">Rs {products.price}</p>
                                                        <p className="w-[486px] top-[163px] left-[27px] font-normal text-lg pl-4 pt-1">{products.description}</p>
                                                        <div className='pt-4'>
                                                            {
                                                                isTokenAvailable
                                                                    ? <button className="bg-[#3A3B48] px-12 py-2 text-white ml-4 rounded-md" onClick={() => onSubmitCart(products)}
                                                                    >
                                                                        {cart?.find((a => a?.productId?._id === products?._id)) ? "Added to cart" : "Add to cart"}
                                                                    </button>
                                                                    : <Link className="bg-[#3A3B48] px-12 py-2 text-white ml-4 rounded-md" to="/login">
                                                                        {cart?.find((a => a?.productId?._id === products?._id)) ? "Added to cart" : "Add to cart"}
                                                                    </Link>
                                                            }
                                                        </div>


                                                    </>

                                                }
                                                </>
                                        }




                                    </>
                            }

                        </div>

                    </div>

                </div >
            </div >
            <Topsales title="Latest products" />
            <Footer />

        </>

    )
}

export default Productpage