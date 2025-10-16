import axios from "axios";

import { authenticationState, userState } from "./domain/state";

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
    const clearAuthHeader = Object
      .keys(response.headers)
      .find(key => key.toLowerCase() === "x-clear-auth-state");
    
    if (clearAuthHeader && response.headers[clearAuthHeader] === "true") {
      // Server detected auth mismatch - clear client state
      authenticationState.setState(authenticationState.getInitialState());
      userState.setState(userState.getInitialState());
    }
    
    return response;
  }
);

export default api;
