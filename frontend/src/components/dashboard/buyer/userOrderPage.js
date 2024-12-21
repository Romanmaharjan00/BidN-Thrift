import React, { useEffect, useRef } from "react";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { publicRequest } from "../../../requestMethods";
import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { BillFormat } from "../admin/BillFormat";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const UserOrderPage = () => {
  //to print bill
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [selectedRowData, setselectedrowdata] = useState();
  const [openPrint, setOpenPrint] = React.useState(false);
  const handleOpenPrint = () => setOpenPrint(true);
  const handleClosePrint = () => setOpenPrint(false);

  const optionButtonMRT = {
    header: "",
    id: "actions",
    size: 2,
    enableColumnActions: false,
    enableColumnOrdering: false,
    enableSorting: false, // disable sorting for this column

    accessorFn: (row) => (
      <div className="flex gap-2">
        {/* print button */}

        <button
          onClick={() => {
            setselectedrowdata();
            setselectedrowdata(row);
            handleOpenPrint();
          }}
        >
          <LocalPrintshopIcon />
        </button>
      </div>
    ),
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Order date",
        size: 150,
        accessorFn: (row) => {
          // Parse createdAt date string into Date object
          const createdAtDate = new Date(row.createdAt);
  
          // Format date with Kathmandu timezone
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Kathmandu",
          };
  
          // Convert date to string with specified format and timezone
          const formattedDate = createdAtDate.toLocaleString("en-US", options);
  
          return formattedDate;
        },
      },
      {
        accessorKey: "_id",
        header: "Order number",
        size: 150,
      },
      {
        accessorKey: "shippingInfo.name", //access nested data with dot notation
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "shippingInfo.address",
        header: "Full Address",
        size: 150,
      },
      {
        accessorKey: "shippingInfo.city", //normal accessorKey
        header: "City",
        size: 200,
      },
      {
        accessorKey: "shippingInfo.pincode", //normal accessorKey
        header: "Pin Code",
        size: 200,
      },
      {
        accessorKey: "shippingInfo.phone", //normal accessorKey
        header: "Phone",
        size: 200,
      },
      {
        accessorKey: "shippingInfo.other",
        header: "Other",
        size: 150,
      },
      {
        accessorKey: "totalprice",
        header: "Total Price",
        size: 150,
      },
      {
        accessorKey: "shippingInfo.paymentMethod",
        header: "Payment method",
        size: 150,
      },
      {
        accessorKey: "paymentOrderId.PIdx",
        header: "Payment id",
        size: 150,
      },
      {
        accessorKey: "orderStatus",
        header: "Order Status",
        size: 150,
      },
      optionButtonMRT,
    ],
    []
  );

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    publicRequest
      .get("user/user-orders")
      .then((res) => {
        const orders = res?.data?.orders?.filter((order) => {
          return order.paymentStatus === 1;
        });
        setOrders(orders.reverse());
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://thriftbids-backend.onrender.com";

  const table = useMaterialReactTable({
    columns,
    data: orders, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableExpandAll: false, //disable expand all button
    muiExpandButtonProps: ({ row }) => ({
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row.original ? (
        <div className="flex flex-col gap-3 ">
          {row.original?.orderItems?.map((order) => {
            return (
              <div className="border p-4 grid grid-cols-2 gap-2">
                <div>
                  <img
                    src={baseUrl + order?.product?.images}
                    className="!w-20 h-20 object-cover"
                  ></img>
                </div>
                <div>
                  <div>Title:{order?.product?.title}</div>
                  <div>Price:{order?.product?.price}</div>
                  <div>Description:{order?.product?.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null,
  });
  return (
    <div className="p-4">
      <p className="pb-2 mb-2 text-bold font-medium text-2xl">Order Page</p>
      <div className="hidden">
        <BillFormat order={selectedRowData} ref={componentRef} />
      </div>

      <Modal
        open={openPrint}
        onClose={handleClosePrint}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="flex flex-col justify-center items-center p-4"
        >
          <p className="text-lg font-medium mb-3">
            Are you sure you want to print receipt?
          </p>

          <div className="flex flex-col">
            <button
              className="bg-[#3A3B48] px-10 py-2 text-white rounded-md"
              onClick={() => {
                handleClosePrint();
                handlePrint();
              }}
            >
              Confirm
            </button>
          </div>
        </Box>
      </Modal>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default UserOrderPage;
