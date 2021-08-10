import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
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

const Listagem = forwardRef((props, ref) => {
  const classes = useStyles();
  const [triggers, setTriggers] = useState([]);
  const { id: idTemplate } = useParams();
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

  const getTriggers = useCallback(async () => {
    await CommonService.getById(`triggers`, idTemplate).then((response) => {
      setTriggers(response.data);
    });
  }, [idTemplate]);

  useImperativeHandle(ref, () => {
    return {
      atualizar: getTriggers,
    };
  });

  useEffect(() => {
    idTemplate !== undefined && getTriggers();
  }, [idTemplate, getTriggers]);

  function remove(id, event) {
    event.preventDefault();
    confirm({
      title: "Tem certeza?",
      description: "Deseja mesmo excluir a trigger?",
      confirmationText: "Sim",
      cancellationText: "Cancelar",
    })
      .then(() => {
        CommonService.delete("trigger", id).then((response) => {
          if (response.status === 204) {
            setTriggers(triggers.filter((m) => m["idTrigger"] !== id)); //seta os novos dados
            informaExclusao();
          } else {
            informaErro({
              titulo: "Erro!",
              mensagem: "Erro ao excluir a trigger! Tente novamente.",
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
          {triggers.map((trigger) => (
            <ListItem key={trigger.idTrigger}>
              <ListItemText
                primary={trigger.descricaoTrigger}
                secondary={`Sensor: ${trigger.descricaoSensor}, Severidade: ${
                  trigger.descricaoSeveridade
                }, Trigger ${trigger.ativo ? "ativada" : "desativada"}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={(e) => props.editarTrigger(e, trigger)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => remove(trigger.idTrigger, e)}
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
          message={"Trigger deletada com Sucesso!"}
        />
      </div>
    </div>
  );
});

export default Listagem;
