import axios from "axios";
// import { getSession } from 'next-auth/react'

export const publicRequest = axios.create({
    baseURL: `http://localhost:5000/api`
  // baseURL: `https://thriftbids-backend.onrender.com/api`
});

publicRequest.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});
