import React, { useState, forwardRef, useImperativeHandle } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const DraggableDialog = forwardRef((values, ref) => {
  const [open, setOpen] = React.useState(false);
  const [valores, setMensagem] = useState({
    titulo: "Erro",
    mensagem: "Erro!",
  });
  const handleOpen = (valores) => {
    setMensagem(valores);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => {
    return {
      handleOpen: handleOpen,
    };
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {valores.titulo}
        </DialogTitle>
        <DialogContent>
          {Object.keys(valores.mensagem).map(function (item) {
            return <DialogContentText key={valores.mensagem}>{valores.mensagem[item]}</DialogContentText>;
          })}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default DraggableDialog;
