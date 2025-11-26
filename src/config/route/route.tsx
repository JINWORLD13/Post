import { createBrowserRouter } from "react-router-dom";
import App from "../../App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <div>Home Page</div> },
      { path: "login", element: <div>Login Page</div> },
      { path: "post", element: <div>Post Page</div> },
      { path: "chart", element: <div>Chart Page</div> },
    ],
  },
]);

export default routes;
