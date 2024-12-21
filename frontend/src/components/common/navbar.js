import React, { useEffect, useState } from "react";
import "./navbar.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import { publicRequest } from "../../requestMethods";
import { useSelector, useDispatch } from "react-redux";
import { updateValue } from "../../reddux/cart/cartslicer";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const location = useLocation();
  const [isadmin, setIsAdmin] = useState(false);

  const currentPage = location?.pathname?.split("/")[1];
  const dispatch = useDispatch();
  let decoded;
  const count = useSelector((state) => state.counter.value);

  const isTokenAvailable = localStorage.getItem("token");

  if (isTokenAvailable) {
    decoded = jwtDecode(isTokenAvailable);
  }

  const checkifAdmin = () => {
    publicRequest
      .get(`/user/${decoded?.id}`)
      .then((res) => {
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

  const fetchproduct = () => {
    publicRequest
      .get(`user/cart`)
      .then((res) => {
        dispatch(updateValue(res?.data?.length));
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  };

  const BasketWithBadge = ({ badgeNumber }) => {
    return (
      <div className="relative">
        <ShoppingBasketIcon className="text-2xl" />
        {badgeNumber > 0 && (
          <span className="absolute top-[-8px] right-[-8px] text-black bg-red-600 rounded-full p-1 text-xs">
            {badgeNumber}
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchproduct();
    checkifAdmin();
  });

  return (
    <>
      <div className="navbar_div flex flex-col w-full justify-center items-center !bg-gray-100">
        <div className="wrapper responsive-width">
          <div className="left">
            <a className="logo text-3xl" href="/">
              <p className="font-normal">BidNthrifT</p>
            </a>
          </div>

          <div className="right">
            <div className="menuitem">
              <a href="/favpage">
                {" "}
                <FavoriteIcon />
              </a>
            </div>
            <div className="menuitem">
              <a href="/shopcart">
                <BasketWithBadge badgeNumber={count} />
              </a>
            </div>

            <div className="menuitem">
              <a
                href={
                  isTokenAvailable ? (isadmin ? "/admin" : "/user") : "/login"
                }
              >
                <PersonIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="navigationitems text-lg pb-3">
          <a
            className={`${currentPage === "" ? "border-b border-b-black" : ""}`}
            href="/"
          >
            Home
          </a>

          <a
            className={`${
              currentPage === "shop" ? "border-b border-b-black" : ""
            }`}
            href="/shop/All"
          >
            Shop
          </a>

          <a
            className={`${
              currentPage === "biddingshop" ? "border-b border-b-black" : ""
            }`}
            href="/biddingshop/All"
          >
            Bidding Shop
          </a>

          <a
            className={`${
              currentPage === "aboutus" ? "border-b border-b-black" : ""
            }`}
            href="/aboutus"
          >
            About us
          </a>

          <a
            className={`${
              currentPage === "how-we-work" ? "border-b border-b-black" : ""
            }`}
            href="/how-we-work"
          >
            How We Work?
          </a>

          <a
            className={`${
              currentPage === "termsandconditions" ? "border-b border-b-black" : ""
            }`}
            href="/termsandconditions"
          >
            Terms & Conditions
          </a>
        </div>
      </div>
    </>
  );
};
export default Navbar;
