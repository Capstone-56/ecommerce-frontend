import MenuContent from "@/resources/components/AdminPage/MenuContent";
import RequireAdmin from "@/resources/components/AdminPage/Authentication";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { UserState } from "@/domain/state";
import { UserService } from "@/services/user-service";

/**
 * The profile page to be showed to admins, where related
 * information will be displayed and can be updated.
 */
export default function AdminProfile() {
  const userName = UserState((state) => state.userName);
  const [userInformation, setUserInformation] = useState(null);

  useEffect(() => {
    document.title = "Profile";
    getAdminInformation();
  }, []);

  /**
   * Function to retrieve user details specifically admin related data.
   * @returns An admin's user details.
   */
  const getAdminInformation = async () => {
    const userService = new UserService();
    if (userName) {
      setUserInformation(await userService.getUser(userName));
    }
  };

  return (
    <>
      <RequireAdmin>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div
            style={{
              minWidth: "260px",
              borderRight: "1px solid #ddd",
              backgroundColor: "#212E4A",
              color: "#8EB5C0",
            }}
          >
            <MenuContent userInformation={userInformation} />
          </div>

          <div
            style={{ flexGrow: 1, padding: "1rem", backgroundColor: "#F0F4F8" }}
          >
            <Outlet context={userInformation} />
          </div>
        </div>
      </RequireAdmin>
    </>
  );
}
