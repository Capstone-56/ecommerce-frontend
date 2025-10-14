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
import AdminSettings from "@/resources/components/AdminPage/Settings/AdminSettings";
import CreateAdminAccount from "@/resources/components/AdminPage/Settings/CreateAdminAccount";
import Payment from "@/resources/pages/Checkout/Payment";
import { Constants } from "@/domain/constants";
import AddProduct from "@/resources/components/AdminPage/ProductManagement/AddProduct/AddProduct";
import OrderComplete from "@/resources/pages/Checkout/OrderComplete";
import OrderHistory from "@/resources/components/AdminPage/OrderHistory/OrderHistory";
import EditProduct from "@/resources/components/AdminPage/ProductManagement/EditProduct/EditProduct";
import CategoryManagement from "@/resources/components/AdminPage/CategoryManagement/CategoryManagement";
import ForgotPassword from "@/resources/pages/Auth/ForgotPassword";
import ResetPassword from "@/resources/pages/Auth/ResetPassword";

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
        path: "forgot",
        element: <ForgotPassword />
      },
      {
        path: "reset/:email/:token",
        element: <ResetPassword />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "checkout",
        element: <Payment />
      },
      {
        path: "order-complete",
        element: <OrderComplete />,
      }

    ],
  },
  {
    path: Constants.ADMIN_DASHBOARD_ROUTE,
    element: <AdminProfile />, // Admin layout for /admin routes
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: "analytics",
        element: <Analytics />
      },
      {
        path: "product/management",
        element: <ProductManagement />
      },
      {
        path: "product/management/add",
        element: <AddProduct />
      },
      {
        path: "product/management/:id",
        element: <EditProduct />
      },
      {
        path: "category",
        element: <CategoryManagement />
      },
      {
        path: "category/management/add",
        element: <div>Add Category (Coming Soon)</div>
      },
      {
        path: "category/management/:internalName",
        element: <div>Edit Category (Coming Soon)</div>
      },
      {
        path: "orders",
        element: <OrderHistory />
      },
      {
        path: "settings",
        element: <AdminSettings />
      },
      {
        path: "settings/create-admin",
        element: <CreateAdminAccount />
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
