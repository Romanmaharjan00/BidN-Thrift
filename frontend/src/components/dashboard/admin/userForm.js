import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { publicRequest } from "../../../requestMethods";
import DashboardSidebar from "../../common/DashboardSidebar";
import TextField from "@mui/material/TextField";
import { enqueueSnackbar } from "notistack";

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
  })
  .required();

const FormHandler = ({ data, id, type }) => {
  const currentURL = window.location.href;
  console.log("currentURL: ", currentURL);


  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { ...data },
    resolver: yupResolver(schema),
  });


  const [responseMessage, setResponseMessage] = useState(false);

  
  const onSubmit = (data) => {
    type === "create"
      ? publicRequest
          .post(`product`, data)
          .then((res) => {
            setResponseMessage(false);
            enqueueSnackbar("User created sucessfully", { variant: "success" });
            navigate("/adminUserPage");
          })
          .catch((err) => {
            setResponseMessage(err?.response?.data?.message);
            console.log("err: ", err?.response?.data?.message);
          })
      : publicRequest
          .put(`user/edit-user/${id}`, data)
          .then((res) => {
            setResponseMessage(false);
            enqueueSnackbar("User edited sucessfully", { variant: "info" });
            navigate("/admin");
          })
          .catch((err) => {
            // setResponseMessage(err?.response?.data?.message)
            setResponseMessage(err?.response?.data?.message);
            console.log("err: ", err?.response?.data?.message);
          });
  };

  return (
    <div><p className="text-4xl ml-6">Edit user details</p>
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
    </div>
  );
};

const UserForm = () => {
  const currentURL = window.location.href;
  console.log("currentURL: ", currentURL.split("/"));
  const checkIfCreate = () => {
    if (
      currentURL.split("/")[3] === "adminUserPage" &&
      currentURL.split("/")[4] === "create"
    )
      return true;

    return false;
  };
  const params = useParams();
  const [data, setData] = useState(false);
  console.log("here");
  useEffect(() => {
    params?.id &&
      publicRequest.get(`user/${params?.id}`).then((res) => {
        console.log("res: ", res?.data);
        setData(res?.data);
      });
  }, [params?.id]);

  if (checkIfCreate()) {
    return (
      <div className="bg-zinc-700 flex items-stretch gap-0 max-md:flex-wrap">
        <DashboardSidebar />
        <FormHandler type="create" />
      </div>
    );
  }
  if (data === false) {
    return <div>Loading...</div>;
  } else return <FormHandler data={data} id={params?.id} />;
};

export default UserForm;
