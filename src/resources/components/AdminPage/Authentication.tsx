// src/auth/RequireAdmin.tsx
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationState, UserState } from "@/domain/state";
import { Role } from "@/domain/enum/role";

type Props = {
  children: ReactNode;
};

/**
 * Is used to layer routes so that only a certain user with the correct permissions
 * can get to the underlying route.
 */
const RequireAdmin = ({ children }: Props) => {
  const navigate = useNavigate();
  const isAuthenticated = AuthenticationState((state) => state.authenticated);
  const userRole = UserState((state) => state.role);

  useEffect(() => {
    if (!isAuthenticated || isAuthenticated && userRole !== Role.ADMIN.valueOf()) {
      navigate(`/404`);
    }
  })

  return <>{children}</>;
};

export default RequireAdmin;
