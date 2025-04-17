import { createBrowserRouter } from "react-router";

import App from "@/App";
import Home from "@/components/Home/Home";
import About from "@/components/About/About";
import Profile from "@/components/Profile/Profile";
import Products from "@/components/Product/Products";
import ProductDetails from "@/components/Product/ProductDetails";
import Categories from "@/components/Categories/Categories";
import NotFound from "@/components/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "products/:id/details",
        element: <ProductDetails />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
]);
