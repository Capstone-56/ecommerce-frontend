import { createBrowserRouter } from "react-router";

import App from "@/App";
import Home from "@/components/Home/Home";
import About from "@/components/About/About";
import NotFound from "@/components/NotFound/NotFound";
import Profile from "@/components/Profile/Profile.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                path: "/",
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/*",
                element: <NotFound />
            }
        ]
    },
]);
