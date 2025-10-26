import { Outlet } from "react-router-dom";

import Navbar from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import PreHeader from "../components/PreHeader/PreHeader";

export default function UserLayout() {
  return (
    <>
      <PreHeader />
      <Navbar />

      <div className="layout">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}
