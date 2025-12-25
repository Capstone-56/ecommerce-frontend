import { ReactNode, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type RouteItemType = {
  name: string;
  routeSuffix: string;
};

const ROUTES: RouteItemType[] = [{
  name: "Account",
  routeSuffix: ""
}, {
  name: "Dates",
  routeSuffix: "/dates"
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
    let toReturn = -1;

    ROUTES.forEach((route, i): void => {
      if (pathname === `/profile${route.routeSuffix}` || pathname === `/profile${route.routeSuffix}/`) {
        toReturn = i;
      }
    });

    return toReturn;
  }, [location]);

  return (
    <div className="absolute inset-0 flex items-stretch justify-center bg-gray-100 mx-auto md:p-8 p-2">
      <div className={`flex lg:flex-row flex-col lg:items-stretch gap-4 rounded-lg shadow-lg border bg-white border-gray-100 p-4 h-full w-full max-w-360`}>
        <div className="flex lg:flex-col flex-row lg:justify-start justify-center gap-1 w-full lg:max-w-64 max-w-full">
          {ROUTES.map((route, i): ReactNode => {
            return (
              <button
                className={`cursor-pointer md:text-lg text-sm rounded-lg lg:text-left text-center ${i === selected ? "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white" : "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700"} transition-colors lg:w-full md:w-30 w-24 md:px-4 px-2 py-2`}
                onClick={(): void => {
                  navigate(`/profile${route.routeSuffix}`);
                }}
              >
                {route.name}
              </button>
            );
          })}
        </div>
        <div className="grow relative">
          {selected !== -1 && (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileV2;
