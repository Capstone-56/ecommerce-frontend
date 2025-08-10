import { Outlet } from "react-router-dom";

import Navbar from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function UserLayout() {
  return (
    <>
      <Navbar />

      <div className="layout">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}
