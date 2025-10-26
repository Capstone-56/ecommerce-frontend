import axios from "axios";

import { authenticationState, userState, cartState } from "./domain/state";

const getHeaderValue = (headers: any, headerName: string): string | undefined => {
  const key = Object
    .keys(headers)
    .find(k => k.toLowerCase() === headerName.toLowerCase());

  return key ? headers[key] : undefined;
};

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

api.interceptors.response.use(
  (response) => {
    // Check every response for the clear signal
    const clearAuthHeader = getHeaderValue(response.headers, "x-clear-auth-state") === "true";
    const clearCartHeader = getHeaderValue(response.headers, "x-clear-auth-cart") === "true";
    
    if (clearAuthHeader) {
      // Server detected auth mismatch - clear client state
      authenticationState.setState(authenticationState.getInitialState());
      userState.setState(userState.getInitialState());

      // Clear cart header for previously auth users
      if (clearCartHeader) {
        cartState.setState(cartState.getInitialState());
      }
    }
    
    return response;
  }
);

export default api;
