import React, { useState } from 'react'

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../requestMethods';

const ProductCard = ({ product }) => {
    const [wishlist, setWishlist] = useState([]);
    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : 'https://thriftbids-backend.onrender.com';
    // Image path from the database
    const imagePath = product?.images;
    const imageUrl = `${baseUrl}${imagePath}`;
    
    const onSubmit = data => {
        const prodId = product?._id; // Assuming _id is the product id field

        

        publicRequest.put(`product/wishlist`, { prodId })
            .then(res => {
                setWishlist(res?.data);
            })
            .catch(error => {
                // Handle error
                console.error("Error adding to wishlist:", error);
            });
    };
    return (
        <div className='flex flex-col'>
            <Link className='hover:shadow-md border-black w-full flex flex-col ' to={`/productpage/${product?._id}`}>
                <div className='m-2'>
                    <img className="w-full flex-grow aspect-square overflow-hidden object-cover"
                        src={product?.images && product.images.length > 0 
                            ? imageUrl
                            : "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"}
                        alt="About Us Image" />
                        {/* {JSON.stringify(imageUrl)} */}
                </div>
                {/* </Link> */}

                <div className='m-2 flex flex-grow justify-between'>
                    {/* <Link className='hover:shadow-md border-black w-full flex flex-col ' to={`/productpage/${product?._id}`}> */}
                    <div>
                        <p className='font-medium text-xl'>{product?.title}</p>
                        {/* <p>{product?.description}</p> */}
                        <p className='text-lg'>Rs. {product?.price}</p>
                    </div>


                    {/* <button onClick={onSubmit}>
                    <FavoriteBorderIcon />
                </button> */}
                </div>
            </Link>
        </div>)
}

export default ProductCard