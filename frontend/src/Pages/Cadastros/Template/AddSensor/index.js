import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useStyles from "./styles";
import Listagem from "./Listagem";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AlertModal from "../../../../Components/Modal/Alert";
import SuccessAlert from "../../../../Components/Alerta/Padrao";
import CommonService from "../../../../Services/common";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MaskedInput from "react-text-mask";
import TestSnmp from "../../../../Components/Modal/TestSnmp";
import { segundosParaIntervalo } from "../../../../Util/conversao.valores";

function DiaHoraMinutoSegundoMask(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, "-", /\d/, /\d/, ":", /\d/, /\d/, ":", /\d/, /\d/]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

export default function TemplateAddSensorTab(props) {
  const {
    children,
    value,
    index,
    sensores,
    setSensores,
    atualizar,
    ...other
  } = props;
  const classes = useStyles();
  const { id: idTemplate } = useParams();
  const refAlertErro = useRef(null);
  const refSuccess = useRef(null);
  const refTestSnmp = useRef(null);
  const sensorZerado = {
    idSensor: 0,
    descricao: "",
    oid: "",
    tipo: "",
    intervalo: " ",
    ativo: true,
    expressao: "",
    idTemplate: idTemplate,
    diasArmazenado: "",
  };
  const [valor, setValor] = useState(sensorZerado);

  const [erros, setErros] = useState({});
  const informaErro = (mensagem) => {
    refAlertErro.current.handleOpen(mensagem);
  };
  const informaSucesso = (message) => {
    refSuccess.current.handleOpenMessage(message);
  };
  const testarSnmp = (event) => {
    event.preventDefault();
    refTestSnmp.current.handleOpen(valor);
  };

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setValor((valor) => ({ ...valor, [name]: value })); //update value array
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (valor.idSensor === 0) {
      CommonService.create("sensor", valor).then((response) => {
        if (response.status === 201) {
          //let abrir = true;
          informaSucesso("Sensor adicionado ao Template com Sucesso!");
          setValor(sensorZerado);
          atualizar();
          setErros({});
        } else {
          setErros(response.data);
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
    } else {
      CommonService.update("sensor", valor.idSensor, valor).then((response) => {
        if (response.status === 200) {
          informaSucesso("Sensor editado com Sucesso!");
          setValor(sensorZerado);
          atualizar();
          setErros({});
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

  function handleCheckedChange(event) {
    setValor({ ...valor, [event.target.name]: event.target.checked });
  }

  function editarSensor(event, sensor) {
    event.preventDefault();
    let sensorTransformado = Object.assign({}, sensor);
    sensorTransformado.intervalo = segundosParaIntervalo(sensor.intervalo);
    if (sensorTransformado.expressao === null)
      sensorTransformado.expressao = "";
    setValor(sensorTransformado);
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
      <form onSubmit={handleFormSubmit} autoComplete="off">
        <Typography variant="h6">Adicionar Sensor</Typography>
        <Grid
          className={classes.root}
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              id="descricao"
              label="Descrição"
              name="descricao"
              value={valor.descricao}
              onChange={handleInputChange}
              error={erros.descricao}
              helperText={erros.descricao}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              id="oid"
              label="OID"
              name="oid"
              value={valor.oid}
              onChange={handleInputChange}
              error={erros.oid}
              helperText={erros.oid}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              id="intervalo"
              label="Intervalo em DD-HH:MM:SS"
              name="intervalo"
              value={valor.intervalo}
              onChange={handleInputChange}
              error={erros.intervalo}
              helperText={erros.intervalo}
              InputProps={{
                inputComponent: DiaHoraMinutoSegundoMask,
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel id="tipo">Tipo</InputLabel>
              <Select
                id="tipo"
                name="tipo"
                value={valor.tipo}
                onChange={handleInputChange}
              >
                <MenuItem value={"bps"}>Bits por segundo</MenuItem>
                <MenuItem value={"BP"}>Bytes</MenuItem>
                <MenuItem value={"%"}>%</MenuItem>
                <MenuItem value={"Texto"}>Texto</MenuItem>
                <MenuItem value={"Uptime"}>Tempo Ligado</MenuItem>
                <MenuItem value={"Numero"}>Número</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              id="expressao"
              label="Processamento do Retorno"
              name="expressao"
              value={valor.expressao}
              onChange={handleInputChange}
              error={erros.expressao}
              helperText={erros.expressao}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              id="diasArmazenado"
              label="Dias de Armazenamento"
              name="diasArmazenado"
              value={valor.diasArmazenado}
              onChange={handleInputChange}
              error={erros.diasArmazenado}
              helperText={erros.diasArmazenado}
              type="number"
            />
          </Grid>

          <Grid item xs={1}>
            <FormControl fullWidth>
              <FormControlLabel
                value="ativo"
                control={
                  <Switch
                    checked={valor.ativo}
                    onChange={handleCheckedChange}
                    name="ativo"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                }
                label="Ativo"
                labelPlacement="top"
              />
            </FormControl>
          </Grid>

          <Grid className={classes.gridButton} item xs={4}>
            <Button
              className={classes.button}
              variant="contained"
              color="default"
              onClick={(e) => testarSnmp(e)}
            >
              Testar
            </Button>

            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={(e) => setValor(sensorZerado)}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h6">Sensores Adicionados</Typography>
      <Listagem
        editarSensor={editarSensor}
        sensores={sensores}
        setSensores={setSensores}
      />
      <AlertModal ref={refAlertErro} />
      <SuccessAlert ref={refSuccess} aberto={false} />
      <TestSnmp ref={refTestSnmp} setValor={setValor} />
    </div>
  );
}
