import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshToken } from "./redux/actions/authAction";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Dashboard from "./pages/settings/dashboard/Dashboard";
import ItemPrice from "./pages/item-price/ItemPrice";
import Template from "./pages/template/Template";
import Request from "./pages/request/Request";
import SignIn from "./pages/signin/SignIn";
import Users from "./pages/settings/users/Users";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import Alerts from "./components/alerts/Alerts";
import "./styles/global.scss";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, []);

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <ItemPrice />,
        },
        {
          path: "/template",
          element: <Template />,
        },
        {
          path: "/request",
          element: <Request />,
        },
        {
          path: "/settings/users",
          element: <Users />,
        },
        {
          path: "/settings/dashboard",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
  ]);

  return (
    <>
      <Alerts />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
