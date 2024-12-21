import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { publicRequest } from '../../requestMethods';

const Biddinglist = () => {
    const location = useLocation();
    const id = location?.pathname?.split("/")[2];
    const [products, setProducts] = useState();

    useEffect(() => {
        fetchproduct()
    }, [id]);

    const fetchproduct = () => {
        publicRequest.get(`product/${id}`)
            .then(res => {
                setProducts(res?.data)
            }).catch(error => {
                // Handle error
                console.error("Error adding to wishlist:", error);
            });
    }

    const bidder_list = products?.bidder_info || []

    return (
        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>

            <div className='py-2 px-4 border-b text-center pb-4'>
                {products?.top_bidder?.firstname?<><p className='text-lg font-bold italic'>**** The top bidder is {products?.top_bidder?.firstname} {products?.top_bidder?.lastname} and the top bid is Rs. {JSON.stringify(products?.top_bid)} ****</p></>
                :<><p className='text-lg font-bold italic'>*** There is no bids currently ***</p></>}
                    
                
                    
            </div>

            <table className="min-w-full bg-white border border-gray-300 ">
               
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Bidding Price</th>
                        <th className="py-2 px-4 border-b">Name</th>
                    </tr>
                </thead>
                <tbody className=''  >
                    {[...bidder_list]?.reverse()?.map((bid, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="py-2 px-4 border-b">{`Rs. ${bid?.bidding_price}`}</td>
                            <td className="py-2 px-4 border-b">{`${bid?.bidder?.firstname} ${bid?.bidder?.lastname}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Biddinglist