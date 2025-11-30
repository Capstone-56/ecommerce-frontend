import { ReactNode, useState } from "react";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { UserService } from "@/services/user-service";
import { Role } from "@/domain/enum/role";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";

const PersonalInfo = ({
  user
}: {
  user: Me
}): ReactNode => {
  const [varUser, setVarUser] = useState(user);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (): Promise<void> => {
    setSaving(true);

    const userService = new UserService();
    const newUser = {
      id: user.id,
      username: user.username,
      email: varUser.email,
      firstName: varUser.firstname,
      lastName: varUser.lastname,
      phone: varUser.phone,
      dateOfBirth: varUser.dateOfBirth !== "" ? varUser.dateOfBirth : null,
      gender: varUser.gender !== "" ? varUser.gender : null,
      role: user.role as Role,
      mfaEnabled: false
    };
    const status = await userService.updateUser(newUser, user.id);

    if (status === StatusCodes.OK) {
      toast.success("Details saved successfully");
    } else {
      toast.error("Failed to update profile");
    }

    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex lg:flex-row flex-col items-start lg:justify-between rounded-lg border-2 border-gray-100 gap-2 p-4">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <p className="font-semibold md:text-2xl text-lg">Personal Information</p>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full">
          <div className="flex flex-col">
            <p className="text-gray-600 md:text-lg text-sm">First Name</p>
            {editing ? (
              <input
                className="rounded-lg border-2 border-gray-200 px-4 py-2"
                value={varUser.firstname}
                onChange={(e): void => {
                  setVarUser({
                    ...varUser,
                    firstname: e.currentTarget.value
                  });
                }}
              />
            ) : (
              <p className="md:text-2xl text-lg">{varUser.firstname}</p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600 md:text-lg text-sm">Last Name</p>
            {editing ? (
              <input
                className="rounded-lg border-2 border-gray-200 px-4 py-2"
                value={varUser.lastname}
                onChange={(e): void => {
                  setVarUser({
                    ...varUser,
                    lastname: e.currentTarget.value
                  });
                }}
              />
            ) : (
              <p className="md:text-2xl text-lg">{varUser.lastname}</p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600 md:text-lg text-sm">Email</p>
            {editing ? (
              <input
                className="rounded-lg border-2 border-gray-200 px-4 py-2"
                type="email"
                value={varUser.email}
                onChange={(e): void => {
                  setVarUser({
                    ...varUser,
                    email: e.currentTarget.value
                  });
                }}
              />
            ) : (
              <p className="md:text-2xl text-lg">{varUser.email}</p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600 md:text-lg text-sm">Phone</p>
            {editing ? (
              <input
                className="rounded-lg border-2 border-gray-200 px-4 py-2"
                value={varUser.phone}
                type="tel"
                onChange={(e): void => {
                  setVarUser({
                    ...varUser,
                    phone: e.currentTarget.value
                  });
                }}
              />
            ) : (
              <p className="md:text-2xl text-lg">{varUser.phone}</p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600 md:text-lg text-sm">Date of Birth</p>
            {editing ? (
              <input
                className="rounded-lg border-2 border-gray-200 px-4 py-2"
                value={varUser.dateOfBirth}
                type="date"
                onChange={(e): void => {
                  setVarUser({
                    ...varUser,
                    dateOfBirth: e.currentTarget.value
                  });
                }}
              />
            ) : (
              <p className={`md:text-2xl text-lg ${varUser.dateOfBirth ? "" : "text-gray-600"}`}>{varUser.dateOfBirth ? new Date(varUser.dateOfBirth).toLocaleDateString() : "--"}</p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600 md:text-lg text-sm">Gender</p>
            {editing ? (
              <select
                className="rounded-lg border-2 border-gray-200 px-4 py-2"
                value={varUser.gender}
                onChange={(e): void => {
                  setVarUser({
                    ...varUser,
                    gender: e.currentTarget.value as ("male" | "female")
                  });
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className={`md:text-2xl text-lg ${varUser.gender ? "" : "text-gray-600"}`}>
                {varUser.gender ? varUser.gender[0].toUpperCase() + varUser.gender.substring(1).toLowerCase() : "--"}
              </p>
            )}
          </div>
        </div>
      </div>
      {editing ? (
        <div className="lg:self-start self-end flex gap-2">
          <button
            className="cursor-pointer rounded-full text-white bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors p-2"
            onClick={handleSave}
            disabled={saving}
          >
            <CheckIcon className="size-4" />
          </button>
          <button
            className="cursor-pointer rounded-full text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors p-2"
            onClick={(): void => {
              setEditing(false);
            }}
            disabled={saving}
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <button
          className="lg:self-start self-end cursor-pointer rounded-full text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors border-2 border-gray-200 p-2"
          onClick={(): void => {
            setEditing(true);
          }}
        >
          <PencilIcon className="size-4" />
        </button>
      )}
    </div >
  );
};

export default PersonalInfo;
