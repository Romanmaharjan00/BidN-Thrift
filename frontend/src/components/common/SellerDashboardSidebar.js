import React, { useState, useEffect } from "react";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

const SellerDashboardSidebar = () => {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonId, href) => {
    setSelectedButton(buttonId);
    navigate(href);
    };
  return (
    <>
      <div className="bg-[#3A3B48] flex w-[260px] shrink-0 h-[1083px] flex-col">
        <a className="text-white m-4 !ml-12 text-4xl font-regular italic" href="/">BidNthrifT</a>
        <div className="flex flex-col gap-2 p-2 mt-2">

          <button
            onClick={() => handleButtonClick("home", "/user")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md `}
          >
            <HomeIcon/>Home
          </button>

          <button
            onClick={() => handleButtonClick("orders", "/user/orderlist")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md `}
          >
            <ShoppingCartCheckoutIcon/>Order list
          </button>

          <button
            onClick={() => handleButtonClick("profile", "/user/profile")}
            className={`block text-start px-10 py-2 w-full text-white rounded-md `}
          >
            <PersonIcon/>My Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default SellerDashboardSidebar;
