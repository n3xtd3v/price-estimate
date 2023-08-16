import "./users.scss";
import DataTable from "../../../components/dataTable/DataTable";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsersSetting } from "../../../redux/actions/settingAction";

const cells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "user_name",
    numeric: true,
    disablePadding: false,
    label: "Account Name",
  },
  {
    id: "cuser",
    numeric: true,
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "cwhen",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "muser",
    numeric: true,
    disablePadding: false,
    label: "Updated By",
  },
  {
    id: "mwhen",
    numeric: true,
    disablePadding: false,
    label: "Updated At",
  },
  {
    id: "role_name",
    numeric: true,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "status_flag",
    numeric: true,
    disablePadding: false,
    label: "isActive",
  },
];

const Users = () => {
  const auth = useSelector((state) => state.auth);
  const settingUser = useSelector((state) => state.setting);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();

  // useEffect(() => {
  //   if (!auth.token && location.pathname === "/settings/users") {
  //     navigate("/signin");
  //   }
  // }, [auth, location]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getUsersSetting(auth));
    }
  }, [auth]);

  return (
    <div className="users">
      {settingUser.users && (
        <DataTable
          title="Users"
          rows={settingUser.users}
          cells={cells}
          auth={auth}
        />
      )}
    </div>
  );
};

export default Users;
