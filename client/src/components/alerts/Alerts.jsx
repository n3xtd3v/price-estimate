import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

import Loading from "../loading/Loading";
import Toast from "./Toast";

const Alerts = () => {
  const alert = useSelector((state) => state.alert);

  const dispatch = useDispatch();

  useEffect(() => {
    if (alert.error || alert.success) {
      setTimeout(() => {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
      }, 10000);
    }
  }, [alert]);

  return (
    <div>
      {alert.loading && <Loading />}

      {alert.error && (
        <Toast msg={{ title: "Error", body: alert.error }} bgColor="error" />
      )}

      {alert.success && (
        <Toast
          msg={{ title: "Success", body: alert.success }}
          bgColor="success"
        />
      )}
    </div>
  );
};

export default Alerts;
