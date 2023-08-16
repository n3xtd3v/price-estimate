import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const SpanningTableEdit = ({ editQtyCharge, charge }) => {
  const [value, setValue] = useState(charge.qty);

  const handleSumbit = (e) => {
    e.preventDefault();

    editQtyCharge(value, charge.item_code);
  };

  return (
    <form onSubmit={handleSumbit}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          autoFocus
          id="outlined-number"
          label="Qty"
          value={value}
          size="small"
          sx={{ width: "50px" }}
          onChange={(e) => setValue(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{ marginLeft: "3px" }}
        >
          Update
        </Button>
      </Box>
    </form>
  );
};

export default SpanningTableEdit;
