import React, { useState, useEffect } from "react";
import Navbar from "../common/navbar";
import Footer from "../homepage/Footer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { publicRequest } from "../../requestMethods";
import { useNavigate, Redirect, Route } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [isadmin, setIsAdmin] = useState();
  const [userId, setUserId] = useState([]);
  let decoded;
  let navigate = useNavigate();

  const schema = yup
    .object({
      email: yup.string().email().required("Email is required"),
      password: yup.string().required("Password is required"),
    })
    .required();
    
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
      .post("user/login", data)
      .then((res) => {
        setResponseMessage(false);
        enqueueSnackbar("Logged in sucessfully", { variant: "success" });
        localStorage.setItem("token", res?.data?.token);
        const isTokenAvailable = res?.data?.token;

        if (isTokenAvailable) {
          decoded = jwtDecode(isTokenAvailable);
          console.log("this is decoded token,", decoded?.id);
        }
        checkifAdmin();
      })
      .catch((err) => {
        setResponseMessage(err?.response?.data?.message);
        console.log("err: ", err?.response?.data?.message);
      });
  };

  const checkifAdmin = () => {
    publicRequest
      .get(`/user/${decoded?.id}`)
      .then((res) => {
        // console.log("this is user role:",res?.data?.role)
        if (res?.data?.role === "admin") {
          setIsAdmin(true);
          console.log("entered");
          navigate("/admin");
        } else {
          setIsAdmin(false);
          navigate("/user");
        }
      })
      .catch((err) => {
        console.error("Error getting user", err);
        setIsAdmin(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center ">
        <div className="flex flex-row m-56 h-full responsive-width">
          <div className="w-1/2">
            <img
              src="https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
              alt="About Us Image"
              className="object-cover w-full h-full"
            />
          </div>
          <form
            className="bg-gray-100 p-12 pb-10 w-1/2 rounded-md shadow-md"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="bg-white p-6 rounded-md w-full mt-9">
              <p className="text-3xl font-bold pb-6 text-gray-700">Login</p>

              <div className="pb-6">
                <input
                  className="input-field"
                  placeholder="Enter username"
                  {...register("email")}
                />
                <span className="text-red-500 text-sm">
                  {errors.email?.message}
                </span>
              </div>

              <div className="pb-6">
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

              <p className="text-red-500">{responseMessage}</p>

              <button
                className="bg-[#3A3B48] text-white py-1 px-10 rounded-md mt-6 h-12 cursor-pointer"
                type="submit"
              >
                Login
              </button>
            </div>

            <a href="/forgotpassword">
              <p className="cursor-pointer text-gray-400 pt-4">
                Forgot password?
              </p>
            </a>

            <a href="/registrationpage">
              <p className="cursor-pointer text-gray-400">
                Don't have an account? Register here.
              </p>
            </a>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;
