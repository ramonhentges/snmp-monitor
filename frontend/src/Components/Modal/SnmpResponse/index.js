import React, { useState, forwardRef, useImperativeHandle } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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
    titulo: "Dados SNMP Recebidos",
    dados: {},
  });
  const handleOpen = (data) => {
    setMensagem((valores) => ({ ...valores, dados: data }));
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
        <List>
          {Object.keys(valores.dados).map(function (item) {
            return (
              <ListItem key={item}>
                <ListItemText
                  primary={"OID " + item}
                  secondary={valores.dados[item]}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DraggableDialog;
