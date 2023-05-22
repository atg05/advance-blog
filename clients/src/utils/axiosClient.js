import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4067/api/v1/",
  withCredentials: true,
});

export default axiosClient;
