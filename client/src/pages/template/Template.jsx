import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./template.scss";

const Template = () => {
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (!auth.token && location.pathname === "/template") {
      navigate("/signin");
    }
  }, [auth]);

  return <div className="Template">Template</div>;
};

export default Template;
