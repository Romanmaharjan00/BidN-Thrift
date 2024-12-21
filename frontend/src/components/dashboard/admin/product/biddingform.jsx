import React, { useState } from 'react'
import TextField from "@mui/material/TextField";
import { publicRequest } from "../../../../requestMethods";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";

const Biddingform = ({ selectedRowData, callData, id, handleClose }) => {
    const expdate = new Date(selectedRowData?.expiry_date).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
    const dateTimeString = expdate;

    // Splitting the date and time
    const [datePart, timePart] = dateTimeString.split(', ');

    // Splitting the date into components
    const [month, day, year] = datePart.split('/');

    // Adding leading zeros to month and day
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');

    // Splitting the time into components
    const [time, ampm] = timePart.split(' ');

    // Adjusting the time format
    const [hours, minutes, seconds] = time.split(':');
    let adjustedHours = hours;

    // Checking AM/PM and adjusting hours accordingly
    if (ampm === 'PM') {
        adjustedHours = String(Number(hours) + 12).padStart(2, '0');
    } else {
        adjustedHours = adjustedHours.padStart(2, '0');
    }

    // Creating the formatted date and time
    const formattedDateTime = `${year}-${formattedMonth}-${formattedDay}T${adjustedHours}:${minutes}:${seconds}`;




    const schema = yup
        .object({
            minimum_bid_amount: yup.number().typeError("Minimum bid cannot be empty").required("Minimum bid is required").moreThan(0, "Minimum bid must be greater than 0"),
            expiry_date: yup
                .date()
                .min(new Date(), "Date must be greater than or equal to today")
                .required("Date is required"),
        })
        .required();

    const [responseMessage, setResponseMessage] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            expiry_date: formattedDateTime,
            minimum_bid_amount: selectedRowData?.minimum_bid_amount,
        },
        resolver: yupResolver(schema),
    });

    console.log("errors from form: ", errors?.expiry_date?.message);

    const onSubmitBidding = (data) => {
        publicRequest
            .put(`product/${id}`, { ...data, bidding: true })
            .then((res) => {
                console.log("res: ", res);
                setResponseMessage(false);
                handleClose();
                callData();
                enqueueSnackbar("Bidding Enabled", { variant: 'success' });
            })
            .catch((res) => {
                setResponseMessage(res?.response?.data?.message);
                console.error("res: ", res);
            });

    }

    return (
        <><div className='flex font-bold text-xl justify-center bg-[#3A3B48] text-white p-4'>Bidding form</div><form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmitBidding)();
            }}
            className="flex flex-col gap-4 p-4"
        >
            {/* <>{JSON.stringify(formattedDateTime)}</> */}


            <TextField
                id="outlined-basic"
                variant="outlined"
                type="datetime-local"
                error={errors?.expiry_date?.message}
                helperText={errors?.expiry_date?.message}

                {...register("expiry_date")}
            />


            {/* <span className="text-red-400">{}</span> */}
            <TextField
                id="outlined-basic"
                variant="outlined"
                type="number"
                error={errors?.minimum_bid_amount?.message}
                helperText={errors?.minimum_bid_amount?.message}
                placeholder="Minimum Bid Amount"
                {...register("minimum_bid_amount")}
            />

            <p className="text-red-400">{responseMessage}</p>
            <button className='bg-[#3A3B48] px-10 py-2 text-white ml-4 rounded-md'>Submit</button>
        </form></>
    )
}

export default Biddingform