import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonId, href) => {
    setSelectedButton(buttonId);
    navigate(href);
    };

  return (
    <div className="relative w-[260px] ">
      <div className="bg-[#3A3B48] flex w-[260px] shrink-0 flex-col fixed top-0 h-screen">
        <p className="text-white m-4 !ml-12 text-4xl font-regular italic">
          <span>
            <a href="/">BidNthrifT</a>
          </span>
        </p>

        <div className="flex flex-col justify-start items-start gap-2 p-2 mt-2">
          <div className="flex flex-start w-full justify-start items-start">
          <button
            onClick={() => handleButtonClick("home", "/admin")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md `}
          >
            <HomeIcon className="mr-2"/>
            Home
          </button>
          </div>

          <button
            onClick={() => handleButtonClick("users", "/adminUserPage")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md`}
          >
            <PeopleAltIcon className="mr-2"/>
            Users
          </button>

          <button
            onClick={() => handleButtonClick("products", "/adminProductPage")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md`}
          >
            <CategoryIcon className="mr-2"/>
            Product list
          </button>

          <button
            onClick={() => handleButtonClick("orders", "/adminPaymentPage")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md `}
          >
            <ShoppingCartCheckoutIcon className="mr-2"/>
            Order list
          </button>

          <button
            onClick={() => handleButtonClick("profile", "/adminProfilePage")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md `}
          >
            <PersonIcon className="mr-2"/>
            My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
