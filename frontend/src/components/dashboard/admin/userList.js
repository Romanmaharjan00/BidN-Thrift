import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { publicRequest } from "../../../requestMethods";
import { Link } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

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

const UserPage = () => {
  const [id, setId] = useState("");
  const [selectedRowData, setselectedrowdata] = useState();

  const handleDelete = (id) => {
    publicRequest.delete(`/user/${id}`)
      .then(res => {
        enqueueSnackbar('User deleted sucessfully',{ variant: 'error' })
        callData()
        handleCloseDelete()
      })
  }

  const optionButtonMRT =
  {
    header: "",
    id: 'actions',
    size: 2,
    enableColumnActions: false,
    enableColumnOrdering: false,
    enableSorting: false, // disable sorting for this column

    accessorFn: (row) =>
      <div className="flex gap-2">
        <Link to={`/adminUserPage/${row?._id}`}><EditIcon style={{ color: 'blue' }}/></Link>
        <button onClick={ () => {
          setselectedrowdata(row);
          setId(row?._id)
          handleOpenDelete()}
        
        }><DeleteIcon style={{ color: 'red' }}/></button>
      </div>
  }
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstname", //access nested data with dot notation
        header: "First Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "lastname", //normal accessorKey
        header: "Last Name",
        size: 200,
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        size: 150,
      },
      optionButtonMRT
    ],
    []
  );
  const [data, setData] = useState([]);

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  useEffect(() => {
    callData()
  }, []);

  const callData = () => {
    publicRequest.get("user/all-users")
      .then(res => {
        console.log('res: ', res?.data);
        setData(res?.data)
      }).catch((err) => {
        console.log("err : ", err);
      });
  }

  return (
    <>
      <div className="p-4">
        <p className="pb-2 mb-2 text-bold font-medium text-4xl bg-[#FFF6F1]">All Users</p>
        <MaterialReactTable table={table} />
      </div >

      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col justify-center items-center p-4">
          <p className="text-lg font-medium mb-3">Are you sure you want to delete?</p>
          
          <div className="flex flex-col">
          <button className="bg-[#3A3B48] px-10 py-2 text-white rounded-md" onClick={() => {
            handleDelete(id)

          }}>Confirm</button></div>
        </Box>
      </Modal>
    </>
  );
};

export default UserPage;
