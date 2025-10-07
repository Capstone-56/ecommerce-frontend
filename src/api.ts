import axios from "axios";

function getApiBaseUrl(): string {
  const hostname = window.location.hostname;
  
  if (hostname.includes("localhost")) {
    return "http://localhost:8000/";
  }

  // Staging environment
  return "https://api.bdnx.com/";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
