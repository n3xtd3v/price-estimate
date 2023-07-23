import Dashboard from "./pages/dashboard/Dashboard";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import ItemPrice from "./pages/item-price/ItemPrice";
import Template from "./pages/template/Template";
import Request from "./pages/request/Request";
import SignIn from "./pages/signin/SignIn";
import Users from "./pages/settings/users/Users";

import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import './styles/global.scss';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'


function App() {

  const queryClient = new QueryClient()

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/item-price",
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
      ]
    },
    {
      path: '/signin',
      element: <SignIn />
    }
  ]);

  return <RouterProvider router={router} />

}

export default App
