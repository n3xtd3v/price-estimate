import { useSelector } from "react-redux";
import SellIcon from "@mui/icons-material/Sell";
import "./navbar.scss";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="navbar">
      <div className="logo">
        <SellIcon />
        <span>Price Estimate</span>
      </div>

      <div className="user">
        <span>{auth.user?.account?.toLowerCase()}</span>
      </div>
    </div>
  );
};

export default Navbar;
