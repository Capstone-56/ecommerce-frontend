import { createBrowserRouter } from "react-router";

import App from '../App.tsx';
import Home from '../components/Home/Home.tsx';
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
                path: "/*",
                element: <NotFound />
            }
        ]
    },
]);
