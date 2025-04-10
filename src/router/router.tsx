import { createBrowserRouter } from "react-router";

import App from '../App.tsx';
import Home from '../components/Home/Home.tsx';
import About from "../components/About/About.tsx";
import Profile from "../components/Profile/Profile.tsx";
import NotFound from '../components/NotFound/NotFound.tsx';

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
