import React, { useEffect, useRef} from "react";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { publicRequest } from "../../../requestMethods";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { useReactToPrint } from "react-to-print";
import { BillFormat } from "./BillFormat";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

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

const PaymentPage = () => {
  //to print bill
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [selectedRowData, setselectedrowdata] = useState();
  const [openPrint, setOpenPrint] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
        <button
          onClick={() => {
            setselectedrowdata(row);
            setId(row?._id);
            handleOpen();
          }}
        >
          <EditIcon style={{ color: "blue" }} />
        </button>


       {/* print button */}

        

        <button
          onClick={() => {
            setselectedrowdata();
            setselectedrowdata(row);
            setId(row?._id)
            handleOpenPrint()
          }}
        >
        <LocalPrintshopIcon/>
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
        header: "Payment Method",
        size: 150,
      },
      {
        accessorKey: "orderStatus",
        header: "Order Status",
        size: 150,
      },
      {
        accessorKey: "paymentOrderId.PIdx",
        header: "Payment id",
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
      .get("user/all-orders")
      .then((res) => {
        console.log("res: ", res?.data);
        const orders = res?.data?.filter((order) => {
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
      <p className="pb-2 mb-2 text-bold font-medium text-4xl">Order Page</p>
      <div className="hidden">
          <BillFormat order={selectedRowData} ref={componentRef} />
        </div>
      <MaterialReactTable table={table} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <OrderStatusForm
            data={selectedRowData?.orderStatus}
            id={selectedRowData?._id}
            getList={getList}
            handleClose={handleClose}
          />
        </Box>
      </Modal>


      <Modal
        open={openPrint}
        onClose={handleClosePrint}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col justify-center items-center p-4">
          <p className="text-lg font-medium mb-3">Are you sure you want to print receipt?</p>
          
          <div className="flex flex-col">
          <button className="bg-[#3A3B48] px-10 py-2 text-white rounded-md" onClick={() => {
            handleClosePrint()
             handlePrint();
          }}>Confirm</button></div>
        </Box>
      </Modal>
    </div>
  );
};

const OrderStatusForm = ({ data, id, getList, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: { orderStatus: data },
    // resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    console.log("data: ", data);
    publicRequest
      .put(`user/update/${id}`, data)
      .then((res) => {
        enqueueSnackbar("Order updated!", { variant: "info" });
        getList();
        handleClose();
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        {...register("orderStatus")}
        inputProps={{ placeholder: "test" }}
        placeholder="Order Status"
        fullWidth
        size="small"
        value={watch("orderStatus")}
        className="mb-4"
      >
        <MenuItem value={"Ordered"}>Ordered</MenuItem>
        <MenuItem value={"Delivery"}>Delivery</MenuItem>
        <MenuItem value={"Delivered"}>Delivered</MenuItem>
      </Select>
      <button
        type="submit"
        className="bg-[#3A3B48] px-10 py-2 text-white rounded-md flex justify-center"
      >
        Submit
      </button>
    </form>
  );
};

export default PaymentPage;
