import axios from "axios";
import { JWTState } from "@/domain/state";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

/**
 * The interceptor used on axios requests to add an Authorisation header with 
 * a bearer token for signed in users. 
 */
axios.interceptors.request.use(
  config => {
    // Gets token from state and appends it to a header within the request.
    const accessToken = JWTState.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * The interceptor used on axios responses. If the response is that of a success it will
 * return normally. In the case that it is a 401 (unauthorised) it will try to refresh the token
 * by hitting the backend for a new access token and then retry the request. If that also errors
 * it means that the refresh token is invalid or expired upon which it will clear those in state
 * and a user is then redirected to the home page. TODO: Change it to sign in.
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Retrieve refresh token and related state functions.
    const refreshToken = JWTState.getState().refreshToken;
    const setAccessToken = JWTState.getState().setAccessToken;
    const removeTokens = JWTState.getState().clearTokens;
    const originalRequest = error.config;

    // If the error was due to being unauthorised it will enter here.
    if (error.response.status === 401 && !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh") &&
        !originalRequest.url.includes("/auth/logout")) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the access token.
        const response = await api.post("http://localhost:8000/auth/refresh", {refresh: refreshToken });
        const newAccessToken = response.data.access;
        
        // If successful set the new access token in state.
        setAccessToken(newAccessToken);

        // Append the new token to the original request sent.
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry that original request with the new token set.
        return axios(originalRequest);
      } catch (tokenRefreshError) {
        // In the case even the refresh token fails, it means its invalid or expired.
        // Remove both tokens if so and redirect the user back to the home page.
        removeTokens();
        window.location.href = "/";
        return Promise.reject(tokenRefreshError);
      }
    }
    return Promise.reject(error);
  }
)

export default api;
