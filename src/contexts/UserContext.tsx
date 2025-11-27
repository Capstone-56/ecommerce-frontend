import { UserService } from "@/services/user-service";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

export const UserContext = createContext<Me | null>(null);

const UserContextProvider = ({
  children
}: {
  children: ReactNode
}): ReactNode => {
  const [loading, setLoading] = useState(true);
  const meRef = useRef<Me | null>(null);

  const init = async (): Promise<void> => {
    const userService = new UserService();
    meRef.current = await userService.getMe();

    setLoading(false);
  };

  useEffect((): void => {
    init();
  }, []);

  return (
    <UserContext.Provider value={meRef.current}>
      {!loading && (
        <>{children}</>
      )}
    </UserContext.Provider>
  )
};

export default UserContextProvider;
