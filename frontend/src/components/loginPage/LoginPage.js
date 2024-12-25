import React, { useState } from "react";
import Navbar from "../common/navbar";
import Footer from "../homepage/Footer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { auth } from "../../firebase/firebase"; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase auth method

const LoginPage = () => {
  const [responseMessage, setResponseMessage] = useState(false);
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      enqueueSnackbar("Logged in successfully", { variant: "success" });
      localStorage.setItem("token", user.accessToken);  // Store Firebase token

      // Redirect based on user role
      checkifAdmin(user);
    } catch (error) {
      setResponseMessage("Invalid email or password");
      enqueueSnackbar(responseMessage, { variant: "error" });
    }
  };

  const checkifAdmin = (user) => {
    // Here, you can implement checking the user's role based on Firestore or Firebase Realtime Database.
    // Assuming you have a collection 'users' where user roles are stored.
    // Use the `user` info (uid, email, etc.) to fetch data from Firestore.

    navigate("/user"); // Default navigation, can modify as per role
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
              <p className="cursor-pointer text-gray-400 pt-4">Forgot password?</p>
            </a>

            <a href="/registrationpage">
              <p className="cursor-pointer text-gray-400">Don't have an account? Register here.</p>
            </a>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
