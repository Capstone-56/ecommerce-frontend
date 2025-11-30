import { UserContext } from "@/contexts/UserContext";
import { ReactNode, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
      <p className="font-semibold text-4xl">My Profile</p>
      <div className="flex items-start justify-between rounded-lg border-2 border-gray-100 p-4">
        <div className="flex items-start gap-4">
          <img src={PROFILE_URL} className="rounded-full border-2 border-gray-100 size-16" />
          <div className="flex flex-col gap-1">
            <p className="text-2xl">Welcome, <span className="font-semibold">{user.username}</span></p>
            <p className="text-gray-600">{user.role === "admin" ? "Admin" : "Customer"}</p>
          </div>
        </div>
        <button className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors border-2 border-gray-200 rounded-full px-4 py-2">
          Edit
        </button>
      </div>
      <div className="flex items-start justify-between rounded-lg border-2 border-gray-100 p-4">
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <p className="font-semibold text-2xl">Personal Information</p>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col">
              <p className="text-gray-600">First Name</p>
              <p className="text-2xl">{user.firstname}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600">Last Name</p>
              <p className="text-2xl">{user.lastname}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600">Email</p>
              <p className="text-2xl">{user.email}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600">Phone</p>
              <p className="text-2xl">{user.phone}</p>
            </div>
          </div>
        </div>
        <button className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors border-2 border-gray-200 rounded-full px-4 py-2">
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserDetailsV2;
