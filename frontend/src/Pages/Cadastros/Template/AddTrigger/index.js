import React, { useState, useRef, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

export default function TemplateAddSensorTab(props) {
  const { children, value, index, sensores, ...other } = props;
  const classes = useStyles();
  const refAlertErro = useRef(null);
  const refSuccess = useRef(null);
  const refListagem = useRef(null);
  const triggerZerado = {
    idTrigger: 0,
    idSensor: 0,
    idSeveridade: "",
    descricao: "",
    ativo: true,
    enviarEmail: true,
    valorComparado: "",
    comparacao: "",
  };
  const [valor, setValor] = useState(triggerZerado);
  const [severidades, setSeveridades] = useState([]);
  const [erros, setErros] = useState({});
  const [sensorSelecionado, setSensorSelecionado] = useState(null);

  useEffect(() => {
    async function getSeveridades() {
      await CommonService.listAll(`severidades`).then((response) => {
        setSeveridades(response.data);
      });
    }
    getSeveridades();
  }, []);

  const informaErro = (mensagem) => {
    refAlertErro.current.handleOpen(mensagem);
  };
  const informaSucesso = (message) => {
    refSuccess.current.handleOpenMessage(message);
  };

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setValor((valor) => ({ ...valor, [name]: value })); //update value array
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (valor.idTrigger === 0) {
      CommonService.create("trigger", valor).then((response) => {
        if (response.status === 201) {
          //let abrir = true;
          informaSucesso("Trigger adicionada ao Template com Sucesso!");
          setValor(triggerZerado);
          setSensorSelecionado(null);
          refListagem.current.atualizar();
        } else {
          setErros(response.data);
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
    } else {
      CommonService.update("trigger", valor.idTrigger, valor).then(
        (response) => {
          if (response.status === 200) {
            informaSucesso("Trigger editada com Sucesso!");
            setValor(triggerZerado);
            setSensorSelecionado(null);
            refListagem.current.atualizar();
          } else {
            setErros(response.data);
            informaErro({
              titulo: "Erro!",
              mensagem: response.data,
            });
          }
        }
      );
    }
  }

  function handleCheckedChange(event) {
    setValor({ ...valor, [event.target.name]: event.target.checked });
  }

  function setSelectedSensor(value) {
    let name = "idSensor";
    let sensor = 0;
    if (value !== null) {
      sensor = value.idSensor;
    }
    setValor((valor) => ({ ...valor, [name]: sensor }));
    setSensorSelecionado(value);
  }

  async function editarTrigger(event, sensorEdit) {
    event.preventDefault();
    await CommonService.getById(`trigger`, sensorEdit.idTrigger).then(
      (response) => {
        setSensorSelecionado(
          sensores.find(
            (sensor, index, array) =>
              sensor.idSensor === response.data[0].idSensor
          )
        );
        setValor(response.data[0]);
      }
    );
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
        <Typography variant="h6">Adicionar Trigger</Typography>
        <Grid
          className={classes.root}
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <Autocomplete
              fullWidth
              id="sensor"
              name="sensor"
              options={sensores}
              getOptionLabel={(option) => option.descricao}
              value={sensorSelecionado}
              onChange={(event, value) => setSelectedSensor(value)}
              renderInput={(params) => (
                <TextField required {...params} label="Sensor" />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel id="comparacao">Comparação</InputLabel>
              <Select
                id="comparacao"
                name="comparacao"
                value={valor.comparacao}
                onChange={handleInputChange}
              >
                <MenuItem value={">"}>Maior que</MenuItem>
                <MenuItem value={"<"}>Menor que</MenuItem>
                <MenuItem value={"!="}>Diferente de</MenuItem>
                <MenuItem value={"=="}>Igual a</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              id="valorComparado"
              label="Valor Comparado"
              name="valorComparado"
              value={valor.valorComparado}
              onChange={handleInputChange}
              error={erros.valorComparado}
              helperText={erros.valorComparado}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel id="idSeveridade">Severidade</InputLabel>
              <Select
                id="idSeveridade"
                name="idSeveridade"
                value={valor.idSeveridade}
                onChange={handleInputChange}
              >
                {severidades.map((severidade) => (
                  <MenuItem
                    key={severidade.idSeveridade}
                    value={severidade.idSeveridade}
                  >
                    {severidade.descricao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Grid item xs={2}>
            <FormControl fullWidth>
              <FormControlLabel
                value="enviarEmail"
                control={
                  <Switch
                    checked={valor.enviarEmail}
                    onChange={handleCheckedChange}
                    name="enviarEmail"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                }
                label="Enviar Email"
                labelPlacement="top"
              />
            </FormControl>
          </Grid>

          <Grid className={classes.gridButton} item xs={3}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={(e) => setValor(triggerZerado)}
            >
              Cancelar
            </Button>

            <Button className={classes.button} variant="contained" color="primary" type="submit">
              Adicionar
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h6">Triggers Adicionadas</Typography>
      <Listagem editarTrigger={editarTrigger} ref={refListagem} />
      <AlertModal ref={refAlertErro} />
      <SuccessAlert ref={refSuccess} aberto={false} />
    </div>
  );
}
