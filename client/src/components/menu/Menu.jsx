import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SellIcon from "@mui/icons-material/Sell";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { signout } from "../../redux/actions/authAction";
import "./menu.scss";

const Menu = () => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch(signout());
  };

  return (
    <div className="menu">
      <div className="item">
        <div className="title">Main</div>
        <Link to="/" className="listItem">
          <div>
            <SellIcon />
          </div>

          <span>item price</span>
        </Link>

        <Link to="/template" className="listItem">
          <div>
            <PostAddIcon />
          </div>

          <span>template</span>
        </Link>

        <Link to="/request" className="listItem">
          <div>
            <DownloadRoundedIcon />
          </div>

          <span>request</span>
        </Link>
      </div>

      {auth.user?.role !== "staff" ? (
        <div className="item">
          <div className="title">Settings</div>
          <Link to="/settings/dashboard" className="listItem">
            <div>
              <DashboardIcon />
            </div>

            <span>Dashboard</span>
          </Link>

          <Link to="/settings/users" className="listItem">
            <div>
              <GroupOutlinedIcon />
            </div>

            <span>Users</span>
          </Link>
        </div>
      ) : (
        ""
      )}

      <div
        className="item"
        style={{ borderTop: "2px solid #384256", paddingTop: "10px" }}
      >
        <Link to="#" className="listItem" onClick={handleSignout}>
          <div>
            <LogoutIcon />
          </div>

          <span>Sign out</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
