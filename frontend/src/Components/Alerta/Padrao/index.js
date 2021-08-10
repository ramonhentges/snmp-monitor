import React, { useState, forwardRef, useImperativeHandle } from "react";
import Snackbar from "@material-ui/core/Snackbar";

const PositionedSnackbar = forwardRef((props, ref) => {
  const [state, setState] = useState({
    open: props.aberto,
    vertical: "top",
    horizontal: "center",
    message: props.message,
  });

  const { vertical, horizontal, open } = state;

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleOpenMessage = (message) => {
    setState({ ...state, open: true, message: message });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useImperativeHandle(ref, () => {
    return {
      handleOpen: handleOpen,
      handleOpenMessage: handleOpenMessage
    };
  });

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        message={state.message}
        key={vertical + horizontal}
        autoHideDuration={2000}
      />
    </div>
  );
});

export default PositionedSnackbar;