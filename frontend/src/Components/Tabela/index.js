import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { uptimeParaTexto } from "../../Util/conversao.valores";

function Tabela(props) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    if (props.formato === "Uptime") {
      const dadosFormatados = [];
      props.dados.dados.dados.forEach((dado) => {
        dadosFormatados.push({
          dataHora: dado.dataHora,
          valor: uptimeParaTexto(dado.valor),
        });
      });
      setDados(dadosFormatados.reverse());
    } else {
        setDados(props.dados.dados.reverse())
    }
  }, [props.formato, props.dados]);
  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Data Checagem</TableCell>
            <TableCell>Valor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dados.map((dado) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={dado.dataHora}>
                <TableCell>{new Date(dado.dataHora).toLocaleString()}</TableCell>
                <TableCell>{dado.valor}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Tabela;
