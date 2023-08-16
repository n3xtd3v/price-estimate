import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import SelectBar from "../../components/selectBar/selectBar";
import SpanningTable from "../../components/SpanningTable";
import Toast from "../../components/Toast";
import "./item-price.scss";

const ItemPrice = () => {
  const auth = useSelector((state) => state.auth);
  const [charges, setCharges] = useState([]);
  const [chargeType, setChargeType] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  let location = useLocation();

  setTimeout(() => {
    if (error === true) {
      setError((prev) => (prev = false));
    }
  }, 5000);

  const addCharges = (value) => {
    const check = charges.some(
      (charge) => charge.item_code === value?.item_code
    );

    if (check) {
      return setError(true);
    } else {
      setCharges([
        ...charges,
        {
          item_code: value.item_code,
          item_name_e: value.item_name_e,
          mph_ipd: value.MPH_IPD,
          mph_opd: value.MPH_OPD,
          mph_ipd_intl: value.MPH_IPD_INTL,
          mph_opd_intl: value.MPH_OPD_INTL,
          qty: 1,
          isEditValue: false,
        },
      ]);

      setError(false);
    }
  };

  const deleteCharge = (code) => {
    setCharges(charges.filter((charge) => charge.item_code !== code));
  };

  const editCharge = (code) => {
    setCharges(
      charges.map((charge) =>
        charge.item_code === code
          ? { ...charge, isEditValue: !charge.isEditValue }
          : charge
      )
    );
  };

  const editQtyCharge = (qty, code) => {
    setCharges(
      charges.map((charge) =>
        charge.item_code === code
          ? { ...charge, isEditValue: !charge.isEditValue, qty }
          : charge
      )
    );
  };

  useEffect(() => {
    if (!auth.token && location.pathname === "/item-price") {
      navigate("/signin");
    }
  }, [auth]);

  return (
    <div className="item-price">
      <h1>Item Price</h1>

      <SelectBar
        addCharges={addCharges}
        setChargeType={setChargeType}
        chargeType={chargeType}
      />

      <SpanningTable
        charges={charges}
        deleteCharge={deleteCharge}
        editCharge={editCharge}
        editQtyCharge={editQtyCharge}
        chargeType={chargeType}
        setChargeType={setChargeType}
      />

      {error ? <Toast msg={"This service type already exists."} /> : ""}
    </div>
  );
};

export default ItemPrice;
