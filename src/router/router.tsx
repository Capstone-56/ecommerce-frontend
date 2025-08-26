import { createBrowserRouter } from "react-router";

import UserLayout from "@/resources/layouts/UserLayout";

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
import AdminProfile from "@/resources/pages/Profile/AdminProfile";
import Analytics from "@/resources/components/AdminPage/Analytics";
import AdminDashboard from "@/resources/components/AdminPage/AdminDashboard/AdminDashboard";
import ProductManagement from "@/resources/components/AdminPage/ProductManagement/ProductManagement";
import VendorManagement from "@/resources/components/AdminPage/VendorManagement";
import CustomerSupport from "@/resources/components/AdminPage/CustomerSupport";
import AdminSettings from "@/resources/components/AdminPage/AdminSettings";
import { Constants } from "@/domain/constants";
import UserDashboard from "@/resources/components/Profile/Dashboard/UserDashboard";
import UserDetails from "@/resources/components/Profile/UserDetails";
import OrderTracking from "@/resources/components/Profile/OrderTracking";
import PurchaseHistory from "@/resources/components/Profile/OrderHistory";
import AddProduct from "@/resources/components/AdminPage/ProductManagement/AddProduct";
import EditProduct from "@/resources/components/AdminPage/ProductManagement/EditProduct";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />, // User layout for default routes
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
        path: "/profile",
        element: <Profile />,
        children: [
          {
            index: true,
            element: <UserDashboard />,
          },
          {
            path: "orders",
            element: <PurchaseHistory />,
          },
          {
            path: "payment",
            element: <OrderTracking />,
          },
          {
            path: "account",
            element: <UserDetails />,
          },
        ],
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
        element: <Cart />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: Constants.ADMIN_DASHBOARD_ROUTE,
    element: <AdminProfile />, // Admin layout for /admin routes
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "product/management",
        element: <ProductManagement />,
      },
      {
        path: "product/management/add",
        element: <AddProduct />,
      },
      {
        path: "product/management/:id",
        element: <EditProduct />,
      },
      {
        path: "vendor/management",
        element: <VendorManagement />,
      },
      {
        path: "support",
        element: <CustomerSupport />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
