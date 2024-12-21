import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { publicRequest } from "../../../requestMethods";
import TextField from "@mui/material/TextField";
import { enqueueSnackbar } from "notistack";
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

const schema = yup
  .object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup.string().required("Email address is required"),
    mobile: yup
      .number()
      .test(
        "len",
        "Phone must be at least 10 digits",
        (val) => String(val).length >= 10
      )
      .typeError("Mobile number cannot be empty").required("Mobile number is required"),
      password: yup.string().required(),
  })
  .required();

const Profiledash = () => {
  const currentURL = window.location.href;
  console.log("currentURL: ", currentURL.split("/")[4]);
  const params = useParams();
  const [data, setData] = useState(false);
  // const url = window.location.href?.split('/')
  console.log("here");

  useEffect(() => {
    publicRequest
      .get(`user/selfuser`)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }, []);
  console.log("data: ", data);

  if (data) return <FormHandler data={data} id={params?.id} />;
  else {
    return <div>Loading...</div>;
  }
};

const FormHandler = ({ data }) => {
  const currentURL = window.location.href;
  console.log("currentURL: ", currentURL);

  let navigate = useNavigate();

  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...data },
    resolver: yupResolver(schema),
  });

  const user_type = window.location.href?.split("/");
  console.log("user_type: ", user_type);

  const onSubmit = (data) => {
    publicRequest
      .put(`user/edit-user/${data._id}`, data)
      .then((res) => {
        setResponseMessage(false);
        enqueueSnackbar("Edited Successfully", { variant: "info" });
        if (user_type[3] === "user") {
          navigate("/user");
        } else navigate("/admin");
      })
      .catch((err) => {
        setResponseMessage(err?.response?.data?.message);
        console.log("err: ", err?.response?.data?.message);
      });
  };

  const changePassword = (data) => {
    publicRequest
      .put(`/user/password`, data)
      .then((res) => {
        console.log("password",data?.password);
        if(data?.password===""){
          setError("Password cannot be empty");
          return
        }
        enqueueSnackbar("Password changed Successfully", { variant: "info" });
        if (user_type[3] === "user") {
          navigate("/user");
        } else navigate("/admin");
      })
      .catch((err) => {
        console.log("err: ", err?.response?.data?.message);
      });
  };


  return (
    <div>
      <p className="text-4xl ml-6">Edit my profile</p>
      <form
        className="flex flex-col justify-center flex-grow items-center pr-10 pl-10 gap-3 whitespace-nowrap pt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <table className="w-full">
          <tr>
            <td>
              <span>First Name:</span>
            </td>
            <td>
              {" "}
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                {...register("firstname")}
                error={errors.firstname}
                helperText={errors.firstname?.message}
                fullWidth
              />
            </td>
          </tr>
          <tr>
            <td>
              <span>Last Name:</span>
            </td>
            <td>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                {...register("lastname")}
                error={errors.lastname}
                helperText={errors.lastname?.message}
                fullWidth
              />
            </td>
          </tr>
          <tr>
            <td>
              <span>Email:</span>
            </td>
            <td>
              {" "}
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                {...register("email")}
                error={errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            </td>
          </tr>
          <tr>
            <td>
              <span>Mobile</span>
            </td>
            <td>
              {" "}
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                {...register("mobile")}
                error={errors.mobile}
                helperText={errors.mobile?.message}
                fullWidth
              />
            </td>
          </tr>
        </table>
        <p className="text-red-400">{responseMessage}</p>
          <button
            className="bg-[#3A3B48] pr-10 pl-10 pt-1 pb-1  text-white cursor-pointer ml-auto rounded-md"
            type="submit"
          >
            Edit
          </button>
        
      </form>
      <div className="flex flex-end pt-4 pr-10">
      <button
        className="bg-[#3A3B48] pr-10 pl-10 pt-1 pb-1  text-white cursor-pointer ml-auto rounded-md"
        type="submit"
        onClick={() => {
          handleOpenDelete();
        }}
      >
        Change password
      </button></div>
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
          <form onSubmit={(e) => { e.preventDefault(); changePassword({ password: newPassword }); }}>Enter new password
          <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(""); // Separate statements inside curly braces
                }}
                fullWidth
                className="pb-2"

              />{error && <div style={{ color: 'red' }}>{error}</div>}
              <div className="flex flex-col">
              
            <button
              className="bg-[#3A3B48] px-10 py-2 text-white rounded-md"
              type="submit"
            >
              Confirm
            </button>
          </div>
          </form>

          
        </Box>
      </Modal>
    </div>
  );
};

export default Profiledash;
