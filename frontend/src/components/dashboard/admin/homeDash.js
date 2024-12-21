import React, { useEffect, useState } from "react";
import { publicRequest } from "../../../requestMethods";
import PieChart from "./product/PieChart";
import BarGraph from "./BarGraph";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PersonIcon from '@mui/icons-material/Person';
const Homedash = () => {
  const [count, setCount] = useState([]);
  const getCount = () => {
    publicRequest
      .get("user/count")
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

  const data = [
    count?.data?.mencount,
    count?.data?.womencount,
    count?.data?.kidcount,
  ];

  return (
    <>
      <div className="bg-[#FFF6F1] h-screen">
        <div className="flex flex-row gap-3">
          <p className="flex ml-6 text-4xl font-semibold">
            Dashboard</p>
        </div>
        <div className="flex justify-between bg-[#FEEEE6] p-4 rounded-lg shadow-md gap-1 m-4">
          <div className="flex flex-col">
            <span className="text-lg font-semibold"><CategoryIcon style={{ fontSize: 32 }}/> Product Count:</span>
            <span className="ml-32 text-3xl font-bold">
              {count?.data?.productcount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold"><InventoryIcon style={{ fontSize: 32 }}/> Product Sold:</span>
            <span className="ml-32 text-3xl font-bold">
              {count?.data?.productsold}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold"><PersonIcon style={{ fontSize: 32 }}/> User Count:</span>
            <span className="ml-28 text-3xl font-bold">
              {count?.data?.usercount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold"><ProductionQuantityLimitsIcon style={{ fontSize: 32 }}/> Order Count:</span>
            <span className="ml-32 text-3xl font-bold">
              {count?.data?.ordercount}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex-grow w-full ml-6 p-4 bg-[#FEEEE6] rounded-md">
            <BarGraph
              productCount={count?.data?.biddingcount}
              orderCount={count?.data?.normalcount}
            />
          </div>
          <div className="w-[800px] h-[600px] m-4 p-4 bg-[#FEEEE6] rounded-md">
            <PieChart data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homedash;
