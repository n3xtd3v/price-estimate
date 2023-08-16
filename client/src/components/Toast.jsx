import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

export default function Toast({ msg }) {
  return (
    <Box sx={{ position: "fixed", right: 20, bottom: 20 }}>
      <Alert severity="error">{msg}</Alert>
    </Box>
  );
}
