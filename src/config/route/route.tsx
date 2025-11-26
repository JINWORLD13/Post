import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/home/Home";
import Auth from "../../pages/auth/Auth";
import Post from "../../pages/post/Post";
import Chart from "../../pages/chart/Chart";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Auth /> },
      { path: "post", element: <Post /> },
      { path: "chart", element: <Chart /> },
    ],
  },
]);

export default routes;
