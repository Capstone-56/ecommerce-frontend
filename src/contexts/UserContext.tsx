import { UserService } from "@/services/user-service";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

type UserContextType = {
  user: Me | null;
  updateUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null, updateUser: async (): Promise<void> => { }
});

const UserContextProvider = ({
  children
}: {
  children: ReactNode
}): ReactNode => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);

  const init = async (): Promise<void> => {
    const userService = new UserService();

    setMe(await userService.getMe());
    setLoading(false);
  };

  useEffect((): void => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{
      user: me,
      updateUser: init
    }}>
      {!loading && (
        <>{children}</>
      )}
    </UserContext.Provider>
  )
};

export default UserContextProvider;
