// src/auth/RequireAdmin.tsx
import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";

type Props = {
  children: ReactNode;
};

/**
 * Is used to layer routes so that only a certain user with the correct permissions
 * can get to the underlying route.
 */
const RequireAdmin = ({ children }: Props) => {
  const navigate = useNavigate();
  const me = useContext(UserContext);

  useEffect(() => {
    if (!me || me.role !== "admin") {
      navigate(`/404`);
    }
  })

  return <>{children}</>;
};

export default RequireAdmin;
