import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";

import HowWeWork from "../HowWeWork/HowWeWork";
import RegistrationPage from "../RegistrationPage/RegistrationPage";
import ShopCart from "../ShoppingCart/ShopCart";
import AboutUsPage from "../aboutUs/AboutUsPage";
import DashboardSidebar from "../common/DashboardSidebar";
import Homedash from "../dashboard/admin/homeDash";
import PaymentPage from "../dashboard/admin/orderPage.js";
import ProductForm from "../dashboard/admin/product/productForm";
import ProductList from "../dashboard/admin/product/productList";
import Profiledash from "../dashboard/admin/profile";

import UserForm from "../dashboard/admin/userForm";
import UserPage from "../dashboard/admin/userList";
import FavoritePage from "../favPage/favoritePage";
import Home from "../homepage/home";
import LoginPage from "../loginPage/LoginPage";
import Productpage from "../productPage/productPage.jsx";
import KidWear from "../shop/KidWear";
import MenWear from "../shop/MenWear";
import Shop from "../shop/Shop";
import WomenWear from "../shop/WomenWear";
import PrivateRoute from "./protectedRoutes";
import UserDash from "../dashboard/buyer/userDash.js";
import ForgotPasswordPage from "../RegistrationPage/ForgotPassword/ForgotPassword.js";
import ResetPasswordPage from "../RegistrationPage/ForgotPassword/resetpassword.js";
import Biddinglist from "../productPage/biddinglist.jsx";
import SellerDashboardSidebar from "../common/SellerDashboardSidebar.js";
import CheckOut from "../checkout/checkOut.jsx";
import PersonIcon from "@mui/icons-material/Person";
import CheckOutSucess from "../checkout/checkOutSucess.jsx";
import UserOrderPage from "../dashboard/buyer/userOrderPage.js";
import CheckOutSingle from "../checkout/checkOutSingle.jsx";
import { jwtDecode } from "jwt-decode";
import { publicRequest } from "../../requestMethods";
import DummyPage from "../DummyPage.js";
import TermsAndCondition from "../TermsAndCondition.js";

const Url = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/aboutus" element={<AboutUsPage />}></Route>
        <Route path="/how-we-work" element={<HowWeWork />}></Route>
        <Route path="/termsandconditions" element={<TermsAndCondition />}></Route>
        <Route path="/shop/All" element={<Shop />}></Route>
        <Route path="/shop/Men" element={<MenWear />}></Route>
        <Route path="/shop/Women" element={<WomenWear />}></Route>
        <Route path="/shop/Kid" element={<KidWear />}></Route>

        <Route path="/biddingshop/All" element={<Shop />}></Route>
        <Route path="/biddingshop/Men" element={<MenWear />}></Route>
        <Route path="/biddingshop/Women" element={<WomenWear />}></Route>
        <Route path="/biddingshop/Kid" element={<KidWear />}></Route>

        <Route
          path="/shopcart"
          element={
            <PrivateRoute>
              <ShopCart />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/favpage"
          element={
            <PrivateRoute>
              <FavoritePage />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/productpage/:id" element={<Productpage />}></Route>
        <Route
          path="/productpage/biddinglist/:id"
          element={<Biddinglist />}
        ></Route>
        <Route path="/registrationpage" element={<RegistrationPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>

        <Route path="" element={<LayoutsWithDefaultNavbar />}>
          <Route path="/admin" element={<Homedash />}></Route>
          <Route path="/adminUserPage" element={<UserPage />}></Route>
          <Route path="/adminUserPage/:id" element={<UserForm />}></Route>
          <Route path="/adminProductPage" element={<ProductList />}></Route>
          <Route path="/adminProductPage/:id" element={<ProductForm />}></Route>
          <Route
            path="/adminProductPage/create"
            element={<ProductForm />}
          ></Route>
          <Route path="/adminPaymentPage" element={<PaymentPage />}></Route>
          <Route path="/adminProfilePage" element={<Profiledash />}></Route>

          <Route path="/user" element={<UserDash />}></Route>
          <Route path="/user/profile" element={<Profiledash />}></Route>
          <Route path="/user/orderlist" element={<UserOrderPage />}></Route>
        </Route>

        <Route path="/forgotpassword" element={<ForgotPasswordPage />}></Route>
        <Route
          path="/user/reset-password/:id"
          element={<ResetPasswordPage />}
        ></Route>
        <Route path="/checkout/:id" element={<CheckOut />}></Route>
        <Route
          path="/checkout/singleproduct/:id"
          element={<CheckOutSingle />}
        ></Route>
        <Route path="/checkout/sucess/:id" element={<CheckOutSucess />}></Route>
        <Route path="/dummy" element={<DummyPage />}></Route>
      </Routes>
    </>
  );
};

function LayoutsWithDefaultNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const userType = window.location.href?.split("/")[3];

  let navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const token = localStorage.getItem("token");
  console.log("token: ", token);

  const [isadmin, setIsAdmin] = useState();
  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }

  const checkifAdmin = () => {
    publicRequest
      .get(`/user/${decoded?.id}`)
      .then((res) => {
        // console.log("this is user role:",res?.data?.role)
        if (res?.data?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch((err) => {
        console.error("Error getting user", err);
        setIsAdmin(false);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (token) {
      checkifAdmin();
    }
  }, [token]);

  return (
    <>
      <div className="bg-[#3A3B48] flex items-stretch max-md:flex-wrap">
        {/* {JSON.stringify(isadmin)} */}
        {!isadmin ? <SellerDashboardSidebar /> : <DashboardSidebar />}
        <div
          className="bg-[#FFF6F1] flex shrink-0 flex-col max-md:max-w-full max-md:mt-10"
          style={{ width: "calc(100% - 260px)", minHeight: "100vh" }}
        >
          <div className="bg-[#FFF6F1] w-full p-3 flex justify-end">
            <div >
              <Avatar onClick={handleClick} className="cursor-pointer !bg-[#3A3B48]">
                <PersonIcon />
              </Avatar>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Typography
                  sx={{ p: 2, cursor: "pointer" }}
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload(false);
                  }}
                >
                  Logout
                </Typography>
              </Popover>
            </div>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Url;
