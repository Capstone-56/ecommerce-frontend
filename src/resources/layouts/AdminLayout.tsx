import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{color: "#000"}}>hello</p>
      <Outlet />
    </div>
  );
};
