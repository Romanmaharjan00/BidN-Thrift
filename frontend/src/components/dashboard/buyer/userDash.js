import React, { useState, useEffect } from "react";
import { publicRequest } from "../../../requestMethods";
import { jwtDecode } from "jwt-decode";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

const UserDash = () => {
  const token = localStorage.getItem("token");
  let decoded;
  if(token){
    decoded = jwtDecode(token);
  }
  
//   console.log(decoded?.id);

  ///count/:userid

  const [count, setCount] = useState([]);
  const getCount = () => {
    publicRequest
      .get(`user/count/${decoded?.id}`)
      .then((res) => {
        setCount(res);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };
  useEffect(() => {
    getCount(); // Fetch count data once when component mounts
  }, []);

  return (
    <>
      <div className="flex justify-between bg-[#FEEEE6] p-4 rounded-lg shadow-md gap-1 m-4">
        <div className="flex flex-col">
          <span className="text-lg font-semibold"><ProductionQuantityLimitsIcon style={{ fontSize: 32 }}/> Order Count:</span>
          <span className="ml-32 text-3xl font-bold">
            {count?.data?.ordercount}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold"><LocalShippingIcon style={{ fontSize: 32 }}/> Order for delivery:</span>
          <span className="ml-44 text-3xl font-bold">
            {count?.data?.orderdeliverycount}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold"><LocalPostOfficeIcon style={{ fontSize: 32 }}/> Order Delivered:</span>
          <span className="ml-40 text-3xl font-bold">
            {count?.data?.orderdeliveredcount}
          </span>
        </div>
      </div>
    </>
  );
};

export default UserDash;
