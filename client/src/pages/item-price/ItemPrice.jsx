import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import SelectBar from "../../components/selectBar/selectBar";
import SpanningTable from "../../components/SpanningTable";
import Toast from "../../components/Toast";
import Box from "@mui/material/Box";
import { postSearchLog } from "../../redux/actions/templateAction";

import { postDataAPI } from "../../utils/fetchData";

const ItemPrice = () => {
  const auth = useSelector((state) => state.auth);
  const itemsPrice = useSelector((state) => state.template.itemsPrice);
  const [charges, setCharges] = useState([]);
  const [chargeType, setChargeType] = useState("");
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (!auth.token && location.pathname === "/") {
      navigate("/signin");
    }
  }, [auth, location]);

  setTimeout(() => {
    if (error === true) {
      setError((prev) => (prev = false));
    }
  }, 5000);

  useEffect(() => {
    setCharges(itemsPrice);
  }, [itemsPrice]);

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
          doctor: value.DOCTOR,
          qty: 1,
          isEditValue: false,
        },
      ]);

      setError(false);
    }
  };

  const addChargesWithFile = async (value) => {
    let itemCode = [];

    for (let i = 0; i < value.length; i++) {
      itemCode.push(value[i][0]);
    }

    let itemCodetoString = itemCode.join();

    const res = await postDataAPI("items", { itemCodetoString }, auth.token);

    let newItems = [];

    for (let i = 0; i < res.data.itemsFixproperty.length; i++) {
      newItems.push({
        item_code: res.data.itemsFixproperty[i].item_code,
        item_name_e: res.data.itemsFixproperty[i].item_name_e,
        mph_ipd: res.data.itemsFixproperty[i].MPH_IPD,
        mph_opd: res.data.itemsFixproperty[i].MPH_OPD,
        mph_ipd_intl: res.data.itemsFixproperty[i].MPH_IPD_INTL,
        mph_opd_intl: res.data.itemsFixproperty[i].MPH_OPD_INTL,
        doctor: res.data.itemsFixproperty[i].DOCTOR,
        qty: 1,
        isEditValue: false,
      });
    }

    setCharges(newItems);
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
    <Box>
      <h1>Item Price</h1>

      <SelectBar
        addCharges={addCharges}
        setChargeType={setChargeType}
        chargeType={chargeType}
      />

      <SpanningTable
        charges={charges}
        setCharges={setCharges}
        deleteCharge={deleteCharge}
        editCharge={editCharge}
        editQtyCharge={editQtyCharge}
        chargeType={chargeType}
        setChargeType={setChargeType}
        addChargesWithFile={addChargesWithFile}
      />

      {error ? <Toast msg={"This service type already exists."} /> : ""}
    </Box>
  );
};

export default ItemPrice;
