import React, {
  useRef,
} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MyAlert from "../../../../../Components/Alerta/Padrao";
import AlertModal from "../../../../../Components/Modal/Alert";
import { useConfirm } from "material-ui-confirm";
import CommonService from "../../../../../Services/common";
import useStyles from "./styles";

export default function Listagem(props) {
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

  function remove(id, event) {
    event.preventDefault();
    confirm({
      title: "Tem certeza?",
      description: "Deseja mesmo excluir o sensor?",
      confirmationText: "Sim",
      cancellationText: "Cancelar",
    })
      .then(() => {
        CommonService.delete("sensor", id).then((response) => {
          if (response.status === 204) {
            props.setSensores(props.sensores.filter((m) => m["idSensor"] !== id)); //seta os novos dados
            informaExclusao();
          } else {
            informaErro({
              titulo: "Erro!",
              mensagem: "Erro ao excluir o sensor! Tente novamente.",
            });
          }
        });
      })
      .catch(() => {});
  }
  return (
    <div>
      <div className={classes.demo}>
        <List>
          {props.sensores.map((sensor) => (
            <ListItem key={sensor.idSensor}>
              <ListItemText
                primary={sensor.descricao}
                secondary={`OID: ${sensor.oid}, Sensor ${
                  sensor.ativo ? "ativado" : "desativado"
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={(e) => props.editarSensor(e, sensor)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => remove(sensor.idSensor, e)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <AlertModal ref={refAlert} />
        <MyAlert
          ref={refDelete}
          aberto={aberto}
          message={"Sensor deletado com Sucesso!"}
        />
      </div>
    </div>
  );
}
