import React, { useEffect, useState } from "react";
import Navbar from "../common/navbar";
import ProductCard from "../homepage/ProductCard";
import { useLocation } from "react-router-dom";
import Footer from "../homepage/Footer";
import SearchIcon from "@mui/icons-material/Search";
import { publicRequest } from "../../requestMethods";
import axios from "axios";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const Shop = () => {
  const location = useLocation();
  const bidding = location?.pathname?.split("/")[1];
  const currentPage = location?.pathname?.split("/")[2];
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState(1);
  const [wishlist, setWishlist] = useState("hello");
  const [search, setSearch] = useState("");
  const [searchbid, setSearchbid] = useState(false);
  const [searchError, setSearchError] = useState("");


  // console.log(wishlist);
  // console.log("bidding:", bidding);

  const currentURL = window.location.href;
  // console.log("currentURL: ", currentURL?.split("/")[4]);
  const category = currentURL?.split("/")[4];
  // const [shopCategory,setshopCategory] = useState("");
  // const shopCategory = "";

  const getCategory = () => {
    if (category === "Men") return "mens";
    if (category === "Women") return "womens";
    if (category === "Kid") return "kids";
    if (category === "All") return "all";
  };

  const urlQuery = () => {
    if (category === "Men") return "?category=mens";
    if (category === "Women") return "?category=womens";
    if (category === "Kid") return "?category=kids";
    return "?";
  };
  const handleSubtract = () => {
    if (pagination > 1) {
      setPagination((prevPagination) => prevPagination - 1);
    }
  };

  const handleAdd = () => {
    if (pagination < totalPages) {
      setPagination((prevPagination) => prevPagination + 1);
    }
  };

  useEffect(() => {
    if (bidding === "biddingshop") {
      publicRequest
        .get(
          `product${urlQuery()}&page=${pagination}&limit=16&bidding=true&sold=0`
        )
        .then((res) => {
          console.log("res: ", res?.data);
          const dataLength = res?.data?.length || 0;
          setTotalPages(dataLength);
          setProducts(res?.data);
          setSearchbid(true);

          if (dataLength == 0) {
            console.log("entered", totalPages);
            setPagination((prevPagination) => prevPagination - 1);
          }
        })
        .catch((error) => {
          setPagination((prevPagination) => prevPagination - 1);
          console.error("An error occurred:", error);
        });
    } else {
      publicRequest
        .get(
          `product${urlQuery()}&page=${pagination}&limit=16&bidding=false&sold=0`
        )
        .then((res) => {
          console.log("res: ", res?.data);
          const dataLength = res?.data?.length || 0;
          setTotalPages(dataLength);
          setProducts(res?.data);
          setSearchbid(false);

          if (dataLength == 0) {
            console.log("entered", totalPages);
            setPagination((prevPagination) => prevPagination - 1);
          }
        })
        .catch((error) => {
          setPagination((prevPagination) => prevPagination - 1);
          console.error("An error occurred:", error);
        });
    }
  }, [currentURL, pagination]);

  const searchResult = (e) => {
    // Check if the search input is empty
    if (!search.trim()) {
      // If empty, display an error message or perform any other action as needed
      setSearchError("Please enter a search term.");
      console.log("Please enter a search term.");
      return; // Exit the function early
    }
    console.log("bidding search type:", searchbid);
    const data = {
      title: search,
      category: getCategory(),
      bidding: searchbid,
    };
    publicRequest
      .post("/product/search", data)
      .then((res) => {
        console.log(res?.data); // data for search result
        
        if(res?.data?.length===0){
          console.log("No such item found");
          setSearchError("No such item found");
        }
        setProducts(res?.data);
        
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-center items-center flex-col w-full m-auto ">
          <div className="!w-full bg-gray-200">
            <div className="font-medium justify-center text-center pt-4 pb-8 text-3xl tracking-widest">
              <p>Category</p>
            </div>
            <div className="flex justify-center font-normal">
              <div className="flex flex-row m-auto gap-14 cursor-pointer text-lg pb-4">
                <p>
                  {bidding === "biddingshop" ? (
                    <a
                      className={`${
                        currentPage === "All" ? "border-b border-b-black" : ""
                      }`}
                      href="/biddingshop/All"
                    >
                      All
                    </a>
                  ) : (
                    <a
                      className={`${
                        currentPage === "All" ? "border-b border-b-black" : ""
                      }`}
                      href="/shop/All"
                    >
                      All
                    </a>
                  )}
                </p>

                {bidding === "biddingshop" ? (
                  <a
                    className={`${
                      currentPage === "Men" ? "border-b border-b-black" : ""
                    }`}
                    href="/biddingshop/Men"
                  >
                    Men
                  </a>
                ) : (
                  <a
                    className={`${
                      currentPage === "Men" ? "border-b border-b-black" : ""
                    }`}
                    href="/shop/Men"
                  >
                    Men
                  </a>
                )}

                {bidding === "biddingshop" ? (
                  <a
                    className={`${
                      currentPage === "Women" ? "border-b border-b-black" : ""
                    }`}
                    href="/biddingshop/Women"
                  >
                    Women
                  </a>
                ) : (
                  <a
                    className={`${
                      currentPage === "Women" ? "border-b border-b-black" : ""
                    }`}
                    href="/shop/Women"
                  >
                    Women
                  </a>
                )}

                {bidding === "biddingshop" ? (
                  <a
                    className={`${
                      currentPage === "Kid" ? "border-b border-b-black" : ""
                    }`}
                    href="/biddingshop/Kid"
                  >
                    Kid
                  </a>
                ) : (
                  <a
                    className={`${
                      currentPage === "Kid" ? "border-b border-b-black" : ""
                    }`}
                    href="/shop/Kid"
                  >
                    Kid
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="responsive-width pt-3">
            <div className="mb-8"></div>
            <div className="flex justify-between pl-8 pr-4 pb-4 pa-4 text-lg font-semibold">
              <a className="text-3xl font-medium">{currentPage}'s Wear</a>
              <div className="flex items-center border border-gray-300 rounded-md w-3/4 px-2">
                <input
                  className="flex-1 pl-2 outline-none h-10"
                  placeholder="What are you looking for?"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchResult();
                    }
                  }}
                />
                <SearchIcon
                  className="items-end cursor-pointer"
                  onClick={() => {
                    searchResult();
                  }}
                />
                
              </div>
              
              
            </div>
            <div className="flex pl-80 ml-4 mb-4">{searchError && <p className="text-red-500 text-lg">{searchError}</p>}</div>
            <div className="grid grid-cols-4 gap-2 ">
              {products?.map((product) => {
                return <ProductCard product={product} />;
              })}
            </div>

            <div className="flex justify-center items-center">
              <button onClick={handleSubtract}>
                <KeyboardArrowLeftIcon />
              </button>
              {pagination}
              <button onClick={handleAdd}>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Shop;
