import { createBrowserRouter } from "react-router";

import UserLayout from "@/resources/layouts/UserLayout";
import AdminLayout from "@/resources/layouts/AdminLayout";

import Home from "@/resources/pages/Home/Home";
import About from "@/resources/pages/About/About";
import Profile from "@/resources/pages/Profile/Profile";
import Products from "@/resources/pages/Product/Products";
import ProductDetails from "@/resources/pages/Product/ProductDetails";
import Categories from "@/resources/pages/Categories/Categories";
import NotFound from "@/resources/pages/NotFound/NotFound";
import Cart from "@/resources/pages/Cart/Cart";

import Login from "@/resources/pages/Auth/Login";
import SignUp from "@/resources/pages/Auth/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,  // User layout for default routes
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "products",
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
        path: "cart",
        element: <Cart />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <SignUp />
      }

    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Admin layout for /admin routes
    children: [
      {
        index: true,
        element: <Home />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
