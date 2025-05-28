import MenuContent from "@/resources/components/AdminPage/MenuContent";
import { Outlet } from "react-router";
import { useEffect } from "react";

/**
 * The profile page to be showed to admins, where related
 * information will be displayed and can be updated.
 */
export default function AdminProfile() {
  useEffect(() => {
    document.title = "Profile";
  }, []);

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div
          style={{
            width: '260px',
            borderRight: '1px solid #ddd',
            backgroundColor: '#212E4A',
            color: "#8EB5C0"
          }}>
          <MenuContent />
        </div>

        <div style={{ flexGrow: 1, padding: '1rem', backgroundColor: '#F0F4F8' }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
