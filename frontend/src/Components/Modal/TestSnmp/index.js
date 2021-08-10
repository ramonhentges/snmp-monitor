import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import useStyles from "./styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SnmpModal from "../SnmpResponse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import CommonService from "../../../Services/common";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import AlertaErro from "../Alert";

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

const TestSnmp = forwardRef((props, ref) => {
  const classes = useStyles();
  const [dadosSnmp, setDados] = useState({});
  const [host, setHost] = useState({ ip: "", porta: "", comunidade: "" });
  const refAlert = useRef(null);
  const refErro = useRef(null);
  const informaDadosSnmp = (dados) => {
    refAlert.current.handleOpen(dados);
  };

  const informaErro = (dados) => {
    refErro.current.handleOpen(dados);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = (dados) => {
    setDados(dados);
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

  useEffect(() => {
    if (localStorage.getItem("hostTesteSnmp") === null) {
      localStorage.setItem(
        "hostTesteSnmp",
        JSON.stringify({ ip: "", porta: "", comunidade: "" })
      );
    }
    setHost(JSON.parse(localStorage.getItem("hostTesteSnmp")));
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const dadosEnvio = {
      ip: host.ip,
      porta: host.porta,
      comunidade: host.comunidade,
      oid: dadosSnmp.oid,
      tipo: dadosSnmp.tipo,
    };
    CommonService.create("testeSnmp", dadosEnvio).then((response) => {
      if (response.data.message === "Sucesso") {
        let resultados = response.data;
        delete resultados.message;
        informaDadosSnmp(resultados);
      } else {
        informaErro({
          titulo: "Erro",
          mensagem: { erro: "Erro ao buscar dados!" },
        });
      }
    });
  }

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setDados((dadosSnmp) => ({ ...dadosSnmp, [name]: value })); //update value array
    props.setValor((dadosSnmp) => ({ ...dadosSnmp, [name]: value }));
  }

  function handleHostChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setHost((host) => ({ ...host, [name]: value }));
    localStorage.setItem(
      "hostTesteSnmp",
      JSON.stringify({ ...host, [name]: value })
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Teste SNMP
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleFormSubmit}
          autoComplete="off"
          className={classes.field}
        >
          <TextField
            fullWidth
            required
            id="ip"
            name="ip"
            label="IP"
            type="text"
            value={host.ip}
            onChange={handleHostChange}
          />

          <TextField
            fullWidth
            required
            id="porta"
            name="porta"
            label="Porta"
            type="number"
            value={host.porta}
            onChange={handleHostChange}
          />

          <TextField
            fullWidth
            required
            id="comunidade"
            name="comunidade"
            label="Comunidade"
            type="text"
            value={host.comunidade}
            onChange={handleHostChange}
          />

          <TextField
            fullWidth
            required
            id="oid"
            name="oid"
            label="OID"
            type="text"
            value={dadosSnmp.oid}
            onChange={handleInputChange}
          />

          <FormControl required fullWidth className={classes.formControl}>
            <InputLabel id="tipo">Tipo</InputLabel>
            <Select
              id="tipo"
              name="tipo"
              value={dadosSnmp.tipo}
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

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Testar
          </Button>
        </form>
        <SnmpModal ref={refAlert} />
        <AlertaErro ref={refErro} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default TestSnmp;
