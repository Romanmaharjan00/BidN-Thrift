import React, { useState } from "react";
import Navbar from "../common/navbar";
import Footer from "../homepage/Footer";
import { useNavigate, Redirect, Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { publicRequest } from "../../requestMethods";
import ReplyIcon from "@mui/icons-material/Reply";
import { enqueueSnackbar } from "notistack";

const schema = yup
  .object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    mobile: yup
      .number()
      .test(
        "len",
        "Phone must be at least 10 digits",
        (val) => String(val).length >= 10
      )
      .typeError("Mobile number cannot be empty")
      .required("Mobile number is required"),
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const RegistrationPage = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [responseMessage, setResponseMessage] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const onSubmit = (data) => {
    publicRequest
      .post("user/register", data)
      .then((res) => {
        enqueueSnackbar("Registered successfully!!", { variant: "success" });
        setResponseMessage(false);
        // localStorage.setItem("token", res?.data?.token);
        navigate("/login");
      })
      .catch((err) => {
        setResponseMessage(err?.response?.data?.message);
        console.log("err: ", err?.response?.data?.message);
      });
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row m-56 h-full responsive-width">
          <div className="w-1/2">
            <img
              src="https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
              alt="About Us Image"
              className="w-full h-full object-cover"
            />
          </div>
          <form
            className="flex flex-col justify-center items-center w-1/2 bg-[#F1F1F1] p-10 "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="bg-white p-11 rounded-md w-full">
              <div className="flex">
                <p className="flex-1 pb-3 text-3xl font-bold text-gray-700">
                  Registration
                </p>
                <a href="/login">
                  <ReplyIcon className="flex justify-end" />
                </a>
              </div>

              <div className="pb-3">
                <input
                  className="input-field"
                  placeholder="Enter firstname"
                  {...register("firstname")}
                />
                <span className="text-red-500 text-sm">
                  {errors.firstname?.message}
                </span>
              </div>

              <div className="pb-3">
                <input
                  className="input-field"
                  placeholder="Enter lastname"
                  {...register("lastname")}
                />
                <span className="text-red-500 text-sm">
                  {errors.lastname?.message}
                </span>
              </div>

              <div className="pb-3">
                <input
                  className="input-field"
                  placeholder="Enter email address"
                  {...register("email")}
                />
                <span className="text-red-500 text-sm">
                  {errors.email?.message}
                </span>
              </div>

              <div className="pb-3">
                <input
                  className="input-field"
                  placeholder="Enter phone number"
                  {...register("mobile")}
                />
                <span className="text-red-500 text-sm">
                  {errors.mobile?.message}
                </span>
              </div>

              <div className="pb-3">
                <input
                  className="input-field"
                  placeholder="Enter password"
                  {...register("password")}
                  type="password"
                />
                <span className="text-red-500 text-sm">
                  {errors.password?.message}
                </span>
              </div>

              <p className="text-red-400">{responseMessage}</p>

              <button
                className="bg-[#3A3B48] py-2 px-10 h-12 rounded-md text-white cursor-pointer"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationPage;
