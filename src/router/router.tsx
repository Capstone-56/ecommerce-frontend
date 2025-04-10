import { createBrowserRouter } from "react-router";

import App from "@/App";
import Home from "@/components/Home/Home";
import About from "@/components/About/About";
import NotFound from "@/components/NotFound/NotFound";

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
                path: "/*",
                element: <NotFound />
            }
        ]
    },
]);
