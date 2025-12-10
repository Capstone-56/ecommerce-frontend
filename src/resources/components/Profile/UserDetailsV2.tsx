import { UserContext } from "@/contexts/UserContext";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import { CameraIcon } from "lucide-react";
import PfpEditor from "./PfpEditor";
import { UserService } from "@/services/user-service";
import { toast } from "react-toastify";

const UserDetailsV2 = (): ReactNode => {
  const { user: userMayNull, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const user = useMemo((): Me => {
    if (userMayNull) {
      return userMayNull;
    } else {
      throw new Error("user must be defined");
    }
  }, [userMayNull]);
  const pfp = useMemo((): string | null => {
    return user.hasPfp ? `https://bdnx-pfp.s3.ap-southeast-2.amazonaws.com/${user.id}.webp?${Date.now()}` : null;
  }, [user]);
  const [newPfp, setNewPfp] = useState("");

  const uploadPfp = async (image: File): Promise<void> => {
    try {
      await (new UserService).uploadPfp(image);

      toast.success("Updated profile picture");
      updateUser();
    } catch {
      toast.error("Failed to upload profile picture");
    }
  };

  const handleInputNewPfp = (): void => {
    const inputElem = document.createElement("input");
    inputElem.type = "file";
    inputElem.multiple = false;
    inputElem.accept = "image/*";

    inputElem.onchange = (): void => {
      const imageFile = inputElem.files?.item(0) ?? null;

      if (!imageFile) {
        return;
      }

      uploadPfp(imageFile);
    };

    inputElem.click();
  };

  const closePfpEditor = (): void => {
    setNewPfp("");
  };

  return (
    <div className="absolute inset-0 flex flex-col gap-2 items-stretch">
      <p className="font-semibold md:text-4xl text-2xl">My Profile</p>
      <div className="flex items-start rounded-lg border-2 border-gray-100 gap-4 p-4">
        <div className="relative rounded-full border-2 border-gray-100 size-16 overflow-clip">
          <img src={pfp ?? "/avatar.png"} className="size-full" />
          <button
            className="absolute inset-0 flex items-center justify-center cursor-pointer size-full opacity-0 hover:opacity-100 text-white active:text-gray-300 bg-black/20 transition-all"
            onClick={handleInputNewPfp}
          >
            <CameraIcon className="size-6" />
          </button>
        </div>
        {newPfp.length > 0 && (
          <div
            className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-10"
            onClick={closePfpEditor}
          >
            <PfpEditor newPfpURI={newPfp} closePfpEditor={closePfpEditor} />
          </div>
        )}
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
