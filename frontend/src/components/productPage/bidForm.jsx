import { yupResolver } from "@hookform/resolvers/yup";
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { publicRequest } from "../../requestMethods";
import { useLocation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";


const BidForm = ({ products, handleClose, fetchproduct }) => {

    const location = useLocation();
    const id = location?.pathname?.split("/")[2];
    const [responseMessage, setResponseMessage] = useState("");
    const maxBidOfProduct = (products?.bidder_info.length > 0) ? Math.max(...products?.bidder_info.map(info => info?.bidding_price)) : products?.price;
  
    const schema = yup
        .object({
            // bid_price: yup.number().min(maxBidOfProduct + products?.minimum_bid_amount).required(),
            bid_price: yup.number().min((maxBidOfProduct + products?.minimum_bid_amount).toFixed(2)).required("Bid price is required"),
        })
        .required()
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { bid_price: (maxBidOfProduct + products?.minimum_bid_amount).toFixed(2) }
    })

    const onSubmit = data => {
        publicRequest.put(`product/bid/${id}`, data)
            .then(res => {
                console.log('res: ', res.data);
                if (res.data == "Bid placed successfully") {
                    setResponseMessage(false);
                    enqueueSnackbar("bid placed sucessfully!!",{ variant: 'success' })
                    fetchproduct()
                    handleClose()
                };
            })
            .catch(err => {
                setResponseMessage(err?.response?.data?.message);
                console.log('err: ', (err?.response?.data?.message));
            })
    };
    return (
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>

            <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                {...register("bid_price")}
                inputProps={{
                    maxLength: 2,
                    step: "0.01"
                }}
                error={errors.bid_price}
                helperText={errors.bid_price?.message}
                placeholder={`${(maxBidOfProduct + products?.minimum_bid_amount).toFixed(2)}`}
                fullWidth
                type="number"
            />
            <span>Minimum Bid Should Be Rs. {(maxBidOfProduct + products?.minimum_bid_amount).toFixed(2)}</span>
            <span className="text-red-500 text-sm">{responseMessage} </span>
            
            <button type="submit" className="bg-[#3A3B48] px-10 py-2 text-white" onClick={onSubmit}>Bid</button>
        </form>
    )
}

export default BidForm