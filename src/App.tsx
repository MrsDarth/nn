import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import BackPropagation from "./pages/Home";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <BackPropagation/>
      },
      {
        path: "test",
        element: "test"
      },
      {
        path: "*",
        element: <Navigate to="/"/>
      }
    ]
  },
], {
  basename: import.meta.env.BASE_URL
});

export default function App() {
  return <RouterProvider router={router}/>;
};
