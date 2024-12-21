import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../../../../requestMethods";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import Biddingform from "./biddingform";
import GavelIcon from "@mui/icons-material/Gavel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  // p: 4,
  borderRadius: 2,
};

const ProductList = () => {
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [data, setData] = useState([]);
  const [selectedRowData, setselectedrowdata] = useState();

  const schema = yup
    .object({
      minimum_bid_amount: yup.number().min(1).required("Minimum bid amount is required"),
      expiry_date: yup
        .date()
        .min(new Date(), "Date must be greater than or equal to today")
        .required("Date is required"),
    })
    .required();

  const {
    formState: { errors },
  } = useForm({
    defaultValues: {
      expiry_date: selectedRowData?.expiry_date, // Current date and time

      minimum_bid_amount: selectedRowData?.minimum_bid_amount, // Current date and time
    },
    resolver: yupResolver(schema),
  });
  const handleDelete = () => {
    publicRequest
      .delete(`/product/${id}`)
      .then((res) => {
        enqueueSnackbar("Product deleted sucessfully", { variant: "error" });
        callData();
        handleCloseDelete();
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  const callData = () => {
    publicRequest
      .get("/product")
      .then((res) => {
        console.log("data: ");
        setData(res?.data);
      })
      .catch((err) => {
        console.log("err : ", err);
      });
  };
  useEffect(() => {
    callData();
  }, []);

  const optionButtonMRT = {
    header: "",
    id: "actions",
    size: 2,
    enableColumnActions: false,
    enableColumnOrdering: false,
    enableSorting: false, // disable sorting for this column

    accessorFn: (row) => (
      <div className="flex gap-2">
        {row.sold === 1 ? (
          <p></p>
        ) : (
          <button
            onClick={() => {
              setselectedrowdata(row);
              setId(row?._id);
              handleOpen();
            }}
          >
            <GavelIcon />
          </button>
        )}

        {row.sold === 1 ? (
          <></>
        ) : (
          <Link to={`/adminProductPage/${row?._id}`}>
            <EditIcon style={{ color: "blue" }} />
          </Link>
        )}

        <button
          onClick={() => {
            setselectedrowdata(row);
            setId(row?._id);
            handleOpenDelete();
          }}
        >
          <DeleteIcon style={{ color: "red" }} />
        </button>
      </div>
    ),
  };
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://thriftbids-backend.onrender.com";
  // Image path from the database

  const columns = useMemo(() => [
    {
      accessorKey: "_id",
      header: "Product code",
      size: 150,
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 150,
    },
    {
      accessorKey: "category", //access nested data with dot notation
      header: "Category",
      size: 150,
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 250,
    },
    {
      accessorKey: "price", //normal accessorKey
      header: "Price",
      size: 200,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      size: 150,
    },
    {
      accessorKey: "sold",
      header: "Sold",
      size: 150,
    },
    {
      accessorKey: "images",
      header: "Images",
      size: 150,
      accessorFn: (row) => (
        <div className="flex gap-2">
          {row?.images?.length > 0 ? (
            <img
              src={`${baseUrl}${row?.images}`}
              className="!w-20 h-20 object-cover"
            />
          ) : (
            <img
              className="!w-20 h-20 object-cover"
              src={
                "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcR039MAfWG3td_9v81sSEYn8U_bdlYuBQ1Gu2WawMolb82IHJUnIMY8Nob-lkyDe6bm-Nl8ozHsADKayLvYnKM"
              }
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: "bidding",
      header: "Bid",
      size: 150,

      accessorFn: (row) => (
        (row.bidding ? "True" : "False")
      ),
    },
    optionButtonMRT,
  ]);

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium text-4xl">Product Page</p>
        <Link
          to="/adminProductPage/create"
          className="bg-[#3A3B48] p-4 py-2 text-white rounded-md"
        >
          Create
        </Link>
      </div>

      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="flex flex-col justify-center items-center p-4"
        >
          <p className="text-lg font-medium mb-3">
            Are you sure you want to delete?
          </p>

          <div className="flex flex-col">
            <button
              className="bg-[#3A3B48] px-10 py-2 text-white rounded-md"
              onClick={() => {
                handleDelete();
              }}
            >
              Confirm
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Biddingform
            selectedRowData={selectedRowData}
            callData={callData}
            id={id}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default ProductList;
