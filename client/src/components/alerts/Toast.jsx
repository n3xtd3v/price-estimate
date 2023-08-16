import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Toast = ({ msg, bgColor }) => {
  return (
    <Alert
      severity={bgColor}
      sx={{ position: "fixed", bottom: "10px", right: "10px" }}
    >
      <AlertTitle>{msg.title}</AlertTitle>
      {msg.body}
    </Alert>
  );
};

export default Toast;
