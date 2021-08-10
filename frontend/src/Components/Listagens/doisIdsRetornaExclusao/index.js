import React, { useRef } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import MyAlert from "../../Alerta/Padrao";
import AlertModal from "../../Modal/Alert";
import { useConfirm } from "material-ui-confirm";
import CommonService from "../../../Services/common";
import useStyles from "./styles";
import Typography from "@material-ui/core/Typography";

/* props:
    valores -> valores exibidos na listagem
    tipo  -> caminho api
    deleteMessage -> nome exibido na exclusão
    message -> mensagem ao excluir com sucesso
    alertaExclusao -> executa função passada com id e descricao do objeto excluído
    setValores -> função setValores dos valores
*/

export default function ItensDoisId(props) {
  const classes = useStyles();
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

  function remove(id1, id2, descricao, event) {
    event.preventDefault();
    confirm({
      title: "Tem certeza?",
      description: "Deseja mesmo excluir o " + props.deleteMessage + "?",
      confirmationText: "Sim",
      cancellationText: "Cancelar",
    })
      .then(() => {
        CommonService.deleteDoisId(props.tipo, id1, id2).then((response) => {
          if (response.status === 204) {
            props.alertaExclusao(id1, descricao);
            props.setValores(
              props.valores.filter(
                (m, n) => m["id1"] !== id1 && n["id2"] !== id2
              )
            ); //seta os novos dados

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
    <div>
      <div className={classes.demo}>
        {props.valores.length !== 0 ? (
          <List>
            {props.valores.map((valores) => (
              <ListItem key={valores.id1 + valores.id2}>
                <ListItemText
                  primary={valores.primary}
                  secondary={valores.secondary}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) =>
                      remove(valores.id1, valores.id2, valores.primary, e)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="subtitle1">Não há dados</Typography>
        )}
        <AlertModal ref={refAlert} />
        <MyAlert ref={refDelete} aberto={aberto} message={props.message} />
      </div>
    </div>
  );
}
