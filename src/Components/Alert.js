import React from "react";
import { CryptoState } from "../CryptoContext";
import { Snackbar, Button, IconButton } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

const Alert = () => {
  const { alert, setAlert } = CryptoState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false });
  };
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={alert.message}
      action={action}
      // style={{
      //   margin: "0 auto !important",
      //   width: "300px",
      //   right: "0 !important",
      //   left: "0 !important",
      // }}
      sx={{
        width: "50%",
        margin: "0 auto !important",
        right: "0 !important",
        left: "0 !important",
      }}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={alert.type}
        sx={{ width: "100%" }}>
        {" "}
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
