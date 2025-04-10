import { useEffect } from "react";

/**
 * The profile page to be showed to users, where related
 * information will be displayed and can be updated.
 */
export default function Profile() {
  useEffect(() => {
    document.title = "Profile Page";
  }, []);

  return (
    <>
      <div>Profile</div>
    </>
  );
};
