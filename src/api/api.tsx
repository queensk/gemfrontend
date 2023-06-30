import axios, { AxiosInstance } from "axios";

const token = localStorage.getItem("token");
const api: AxiosInstance = axios.create({
  baseURL: "https://gemapiv1.azurewebsites.net/",
  headers: {
    Authorization: `JWT ${token}`,
  },
});

export default api;
