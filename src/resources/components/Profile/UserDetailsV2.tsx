import { UserContext } from "@/contexts/UserContext";
import { ReactNode, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";

const PROFILE_URL = "https://randomuser.me/api/portraits/men/32.jpg";

const UserDetailsV2 = (): ReactNode => {
  const userMayNull = useContext(UserContext);
  const navigate = useNavigate();
  const user = useMemo((): Me => {
    if (userMayNull) {
      return userMayNull;
    } else {
      navigate("/");

      throw new Error("user must be defined");
    }
  }, [userMayNull]);

  return (
    <div className="absolute inset-0 flex flex-col gap-2 items-stretch">
      <p className="font-semibold md:text-4xl text-2xl">My Profile</p>
      <div className="flex items-start rounded-lg border-2 border-gray-100 gap-4 p-4">
        <img src={PROFILE_URL} className="rounded-full border-2 border-gray-100 size-16" />
        <div className="flex flex-col gap-1">
          <p className="md:text-2xl text-lg">Welcome, <span className="font-semibold">{user.username}</span></p>
          <p className="text-gray-600 md:text-lg text-sm">{user.role === "admin" ? "Admin" : "Customer"}</p>
        </div>
      </div>
      <PersonalInfo user={user} />
    </div>
  );
};

export default UserDetailsV2;
