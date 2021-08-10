import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AlertModal from "../../../../Components/Modal/Alert";
import CommonService from "../../../../Services/common";
import useStyles from "./styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function Host(props) {
  const { children, value, index, ...other } = props;
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const refAlert = useRef(null);
  const [campos, setCampos] = useState({
    nome: "",
    ip: "",
    porta: "",
    comunidade: "",
    emailIndisponibilidade: true,
  });

  const [erros, setErros] = useState({});

  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };

  useEffect(() => {
    async function getHost() {
      if (id !== undefined) {
        await CommonService.getById("host", id)
          .then((response) => {
            delete response.data["idHost"];
            setCampos(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    getHost();
  }, [id]);

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    //setTheArray(oldArray => [...oldArray, newElement]); //add new element to the array
    setCampos((campos) => ({ ...campos, [name]: value })); //update value array
  }

  function handleCheckedChange(event) {
    setCampos({ ...campos, [event.target.name]: event.target.checked });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (id === undefined) {
      CommonService.create("host", campos).then((response) => {
        if (response.status === 201) {
          history.push({
            pathname: `hostform/${response.data.id}`,
            state: {
              abrir: true,
              message: "Host cadastrado com sucesso!",
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
      CommonService.update("host", id, campos).then((response) => {
        if (response.status === 200) {
          props.alertaCadastro("Host editado com Sucesso!");
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
              id="nome"
              name="nome"
              label="Nome do Host"
              type="text"
              value={campos["nome"]}
              onChange={handleInputChange}
              error={erros.nome}
              helperText={erros.nome}
            />
          </div>
          <div>
            <TextField
              required
              id="ip"
              name="ip"
              label="IP do Host"
              type="text"
              value={campos["ip"]}
              onChange={handleInputChange}
              error={erros.ip}
              helperText={erros.ip}
            />
          </div>
          <div>
            <TextField
              required
              id="porta"
              name="porta"
              label="Porta de comunicação"
              type="number"
              value={campos["porta"]}
              onChange={handleInputChange}
              error={erros.porta}
              helperText={erros.porta}
            />
          </div>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                required
                id="comunidade"
                name="comunidade"
                label="Comunidade SNMP"
                type="text"
                value={campos["comunidade"]}
                onChange={handleInputChange}
                error={erros.comunidade}
                helperText={erros.comunidade}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <FormControlLabel
                  value="emailIndisponibilidade"
                  control={
                    <Switch
                      checked={campos.emailIndisponibilidade}
                      onChange={handleCheckedChange}
                      name="emailIndisponibilidade"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                  }
                  label="Enviar email ao estar Indisponível"
                  labelPlacement="top"
                />
              </FormControl>
            </Grid>
          </Grid>
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
