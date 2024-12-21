import React from "react";
import { useLocation } from "react-router-dom";
import Shop from "./Shop";


const KidWear = () => {

    const location = useLocation();
    const currentPage = location?.pathname?.split("/")[2];
    console.log(currentPage)
    return(
        <>
    <Shop/>
        
</>
    );
};

export default KidWear