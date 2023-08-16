import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./request.scss";

export const Request = () => {
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (!auth.token && location.pathname === "/request") {
      navigate("/signin");
    }
  }, [auth]);

  return <div className="request">Request</div>;
};

export default Request;
