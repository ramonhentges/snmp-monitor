import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MyAlert from "../../Alerta/Padrao";
import AlertModal from "../../Modal/Alert";
import { useConfirm } from "material-ui-confirm";
import CommonService from "../../../Services/common";
import useStyles from "./styles";
import TextField from "@material-ui/core/TextField";

/* props:
    valores -> valores exibidos na listagem
    tipo  -> caminho api
    deleteMessage -> nome exibido na exclusão
    message -> mensagem ao excluir com sucesso
*/

function viewButton(view, viewLink, id) {
  if (view) {
    return (
      <IconButton
        edge="end"
        aria-label="view"
        component={Link}
        to={"/" + viewLink + "/" + id}
      >
        <VisibilityIcon />
      </IconButton>
    );
  }
}

export default function Itens(props) {
  const classes = useStyles();
  const [valores, setValores] = useState([]);
  const [valoresBusca, setValoresBusca] = useState([]);
  const [busca, setBusca] = useState("");
  let aberto = false;
  const refDelete = useRef(null);
  const refAlert = useRef(null);
  const confirm = useConfirm();
  const informaExclusao = () => {
    refDelete.current.handleOpen();
  };
  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };
  function handleBuscaChange(event) {
    event.preventDefault();
    setBusca(event.target.value);
    setValoresBusca(
      valores.filter((valor) => {
        return (
          (valor.primary &&
            valor.primary
              .toLowerCase()
              .includes(event.target.value.toLowerCase())) ||
          (valor.secondary &&
            valor.secondary
              .toLowerCase()
              .includes(event.target.value.toLowerCase()))
        );
      })
    );
  }
  useEffect(() => {
    setValoresBusca(props.valores);
    setValores(props.valores);
  }, [props]);

  function remove(id, event) {
    event.preventDefault();
    confirm({
      title: "Tem certeza?",
      description: "Deseja mesmo excluir o " + props.deleteMessage + "?",
      confirmationText: "Sim",
      cancellationText: "Cancelar",
    })
      .then(() => {
        CommonService.delete(props.tipo, id).then((response) => {
          if (response.status === 204) {
            setValoresBusca(valoresBusca.filter((m) => m["id"] !== id)); //seta os novos dados
            informaExclusao();
          } else {
            informaErro({
              titulo: "Erro!",
              mensagem:
                "Erro ao excluir o " +
                props.deleteMessage +
                "! Tente novamente.",
            });
          }
        });
      })
      .catch(() => {});
  }
  return (
    <div className={classes.demo}>
      <TextField
        fullWidth
        id="buscaItem"
        label="Busca"
        value={busca}
        onChange={handleBuscaChange}
        autoComplete="off"
      />
      <List>
        {valoresBusca.map((valores) => (
          <ListItem key={valores.id}>
            <ListItemText
              primary={valores.primary}
              secondary={valores.secondary}
            />
            <ListItemSecondaryAction>
              {viewButton(props.view, props.viewLink, valores.id)}
              <IconButton
                edge="end"
                aria-label="edit"
                component={Link}
                to={"/" + props.tipo + "form/" + valores.id}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => remove(valores.id, e)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <AlertModal ref={refAlert} />
      <MyAlert ref={refDelete} aberto={aberto} message={props.message} />
    </div>
  );
}
