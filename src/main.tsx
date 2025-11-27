import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";

import { lightTheme } from "./assets/theme/BDNX.ts";

import LocationProvider from "./providers/LocationProvider";

import { router } from "./router/router.tsx";
import { Slide, ToastContainer } from "react-toastify";
import UserContextProvider from "./contexts/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px white inset",
            WebkitTextFillColor: "#000",
            fontFamily:
              "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
            transition: "background-color 9999s ease-out 0s",
          },
        }}
      />
      <LocationProvider>
        <UserContextProvider>
          <RouterProvider router={router} />
        </UserContextProvider>
      </LocationProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </ThemeProvider>
  </StrictMode>
);
