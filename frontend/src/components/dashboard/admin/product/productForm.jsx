import { yupResolver } from "@hookform/resolvers/yup";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from "yup";
import { publicRequest } from '../../../../requestMethods';
import FormControl from '@mui/material/FormControl';
import { enqueueSnackbar } from "notistack";


const FormHandler = ({ data, id, type }) => {
    
    const schema = yup
        .object({
            title: yup.string().required("Title is required"),
            description: yup.string().required("Description is required"),
            price: yup.number().typeError("Price cannot be empty").required("Price is required").moreThan(0, "Price must be greater than 0"),
            category: yup.string().required(),
            image: type === 'create' ? yup.mixed().required("Image is required") : yup.mixed(),
        })
        .required()

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: { ...data,},
        resolver: yupResolver(schema),
    });
    console.log("images:",data?.images);

    useEffect(() => {
        register('image'); // Register image input when component mounts
    }, [register]);
    
    const [responseMessage, setResponseMessage] = useState(false);

    const onSubmit = (data) => {
        console.log("data from submit: ", data);
        // Handle image upload separately
        const formdata = new FormData();
        Object.entries(data)?.map(([key, value]) => {
            formdata.append(key, value);
        });

        console.log("formdata: ", formdata);
        // Update the form data without the photo before submitting the main form
        type === 'create'
            ? publicRequest
                .post('product', formdata)
                .then((res) => {
                    setResponseMessage(false);
                    enqueueSnackbar("Product created!", { variant: 'success' })
                    navigate('/adminProductPage');
                })
                .catch((err) => {
                    setResponseMessage(err?.response?.data?.message);
                    console.log('err from creation: ', err?.response?.data?.message);
                })
            : publicRequest
                .put(`product/${id}`, data)

                .then((res) => {
                    console.log("sucess info: ", res);
                    setResponseMessage(false);
                    enqueueSnackbar("Product updated!", { variant: 'info' })
                    navigate('/adminProductPage');
                })
                .catch((err) => {
                    setResponseMessage(err?.response?.data?.message);
                    console.log('err: ', err?.response?.data?.message);
                });


    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setValue('image', file);
    };
    return (
        <div><p className="text-4xl ml-6">{type === 'create' ? "Create new product" : "Edit product details"}</p>
        <form className="flex flex-col justify-start flex-grow items-center gap-3 w-full pt-10 px-4 " onSubmit={handleSubmit(onSubmit)}>
            {/* {JSON.stringify(imgfile)} */}

            <table className="w-full">
                <tr>
                    <td><span>Title:</span></td>
                    <td> <TextField size="small" id="outlined-basic" variant="outlined" {...register("title")} error={errors.title} helperText={errors.title?.message} fullWidth /></td>
                </tr>
                <tr>
                    <td><span>Description:</span></td>
                    <td><TextField size="small" id="outlined-basic" variant="outlined" {...register("description")} error={errors.description} helperText={errors.description?.message} fullWidth /></td>
                </tr>
                <tr>
                    <td><span>Price:</span></td>
                    <td>  <TextField size="small" id="outlined-basic" variant="outlined" {...register("price")} error={errors.price} type="number"
                        inputProps={{
                            maxLength: 2,
                            step: "0.01"
                        }} helperText={errors.price?.message} fullWidth /></td>
                </tr>
                <tr>
                    <td><span>Category:</span></td>
                    <td>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                {...register("category")}
                                placeholder="check"
                                fullWidth
                                size="small"
                                value={watch('category') || "mens"}
                            >
                                <MenuItem value={"mens"}>Mens</MenuItem>
                                <MenuItem value={"womens"}>Womens</MenuItem>
                                <MenuItem value={"kids"}>Kids</MenuItem>
                            </Select>
                        </FormControl>
                    </td>
                </tr>
                {
                    type === 'create'
                    &&
                    <tr>
                        <td><span>Photo:</span></td>
                        <td>
                            <input type="file" onChange={handlePhotoChange} className="pt-1"/>

                            {errors.image && <p className="text-red-500 text-sm pl-4">{errors.image.message}</p>}

                        </td>
                    </tr>
                }
            </table>
            <p className="text-red-400">{responseMessage}</p>
            <button className="bg-[#3A3B48] pr-10 pl-10 pt-1 pb-1  text-white cursor-pointer ml-auto rounded-md" type="submit">Submit</button>

        </form>
        </div>
    )
}


const ProductForm = () => {
    const currentURL = window.location.href
    console.log('currentURL: ', currentURL.split('/'));
    const checkIfCreate = () => {
        if (currentURL.split('/')[3] === 'adminProductPage' && currentURL.split('/')[4] === 'create')
            return true

        return false
    }
    const params = useParams();
    const [data, setData] = useState(false);

    useEffect(() => {
        params?.id && publicRequest.get(`product/${params?.id}`)
            .then(res => {
                console.log('res: ', res?.data);
                setData(res?.data)
            })
            .catch(err => {
                console.log('err: ', err);

            })
    }, [params?.id]);

    if (checkIfCreate()) {
        return (
            <FormHandler type="create" />
        )
    }
    if (data === false) {
        return (<div>Loading...</div>)
    }
    else
        return (
            <FormHandler data={data} id={params?.id} />
        )
}

export default ProductForm