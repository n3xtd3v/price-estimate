import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";

const SelectBar = ({ addCharges, setChargeType, chargeType }) => {
  const [itemType, setItemType] = useState("");
  const [data, setData] = useState([]);

  const handleChangeSelectItemType = async (e) => {
    const { value } = e.target;

    setItemType(value);

    const res = await (
      await fetch(`http://localhost:5051/api/items/${value}`)
    ).json();

    const data = res.items.recordset;
    setData(data);
  };

  const handleChangeSelectChargeType = (e) => {
    const { value } = e.target;

    setChargeType(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        marginY: "10px",
        flexDirection: { xs: "column", xl: "row" },
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Step 1 select item type
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={itemType}
          onChange={handleChangeSelectItemType}
          sx={{ background: "white" }}
        >
          <MenuItem value={"service"}>Service</MenuItem>
          <MenuItem value={"inventory"}>Inventory</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          disableClearable
          id="combo-box-demo"
          options={data}
          getOptionLabel={(data) => `${data.item_code}: ${data.item_name_e}`}
          onChange={(event, newValue) => {
            addCharges(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Step 2 search item code or name"
              sx={{ background: "white", borderRadius: "5px" }}
            />
          )}
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Step 3 select charge type
        </InputLabel>

        <Select
          labelId="demo-simple-select-label"
          id="selectChargeType"
          value={chargeType}
          onChange={handleChangeSelectChargeType}
          sx={{ background: "white" }}
        >
          <MenuItem value={"ipd"}>IPD</MenuItem>
          <MenuItem value={"opd"}>OPD</MenuItem>
          <MenuItem value={"ipd_intl"}>IPD INTL</MenuItem>
          <MenuItem value={"opd_intl"}>OPD INTL</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectBar;
