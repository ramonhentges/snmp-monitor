import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AlertModal from "../../../../Components/Modal/Alert";
import CommonService from "../../../../Services/common";
import useStyles from "./styles";

export default function TemplateFormTab(props) {
  const { children, value, index, ...other } = props;
  const { id } = useParams();
  const classes = useStyles();
  let history = useHistory();
  const refAlert = useRef(null);
  const [campos, setCampos] = useState({
    descricao: "",
  });

  const [erros, setErros] = useState({});

  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };

  useEffect(() => {
    async function getTemplate() {
      if (id !== undefined) {
        await CommonService.getById("template", id)
          .then((response) => {
            delete response.data[0]["idTemplate"];
            setCampos(response.data[0]);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    getTemplate();
  }, [id]);

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    //setTheArray(oldArray => [...oldArray, newElement]); //add new element to the array
    setCampos((campos) => ({ ...campos, [name]: value })); //update value array
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (id === undefined) {
      CommonService.create("template", campos).then((response) => {
        if (response.status === 201) {
          history.push({
            pathname: `templateform/${response.data.id}`,
            state: {
              abrir: true,
              message: "Template cadastrado com sucesso!",
            },
          });
        } else {
          setErros(response.data);
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
    } else {
      CommonService.update("template", id, campos).then((response) => {
        if (response.status === 200) {
          props.alertaCadastro("Template editado com Sucesso!");
          props.setAba(1);
        } else {
          setErros(response.data);
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
    }
  }
  return (
    <div
      className={classes.root}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <form
          onSubmit={handleFormSubmit}
          autoComplete="off"
          className={classes.field}
        >
          <div>
            <TextField
              required
              id="descricao"
              name="descricao"
              label="Descrição da Templete"
              type="text"
              value={campos["descricao"]}
              onChange={handleInputChange}
              error={erros.descricao}
              helperText={erros.descricao}
            />
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Salvar
          </Button>
          <AlertModal ref={refAlert} />
        </form>
      )}
    </div>
  );
}
