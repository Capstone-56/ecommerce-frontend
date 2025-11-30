import { ReactNode, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ROUTES = [{
  name: "Account",
  routeSuffix: ""
}, {
  name: "Addresses",
  routeSuffix: "/shipping"
}, {
  name: "Orders",
  routeSuffix: "/orders"
}];

const ProfileV2 = (): ReactNode => {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = useMemo((): number => {
    const pathname = location.pathname;

    if (pathname === "/profile") {
      return 0;
    } else if (pathname === "/profile/shipping") {
      return 1;
    } else if (pathname === "/profile/orders") {
      return 2;
    } else {
      return -1;  // unlikely case
    }
  }, [location]);

  return (
    <div className="absolute inset-0 flex items-stretch justify-center bg-gray-100 mx-auto p-8">
      <div className="flex items-start gap-2 rounded-lg shadow-lg border bg-white border-gray-100 p-4 h-full w-full max-w-360">
        <div className="flex flex-col gap-1 w-64">
          {ROUTES.map((route, i): ReactNode => {
            return (
              <button
                className={`cursor-pointer rounded-lg text-left ${i === selected ? "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white" : "bg-transparent hover:bg-black/10 active:bg-black/20 text-gray-600"} transition-colors px-4 py-2`}
                onClick={(): void => {
                  navigate(`/profile${route.routeSuffix}`);
                }}
              >
                {route.name}
              </button>
            );
          })}
        </div>
        <div>
          {selected !== -1 && (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileV2;
