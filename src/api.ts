import axios from "axios";

const api = axios.create({
  baseURL: "https://api.bdnx.com/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
