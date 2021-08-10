import React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Dashboard from "./Pages/Aplicacao/Dashboard";
import GroupForm from "./Pages/Cadastros/HostGroup";
import HostGroupList from "./Pages/Listagens/HostGroup";
import HostForm from "./Pages/Cadastros/Host";
import HostList from "./Pages/Listagens/Host";
import Problemas from "./Pages/Aplicacao/Problemas";
import TemplateForm from "./Pages/Cadastros/Template";
import TemplateList from "./Pages/Listagens/Template";
import EmailForm from "./Pages/Cadastros/Email";
import SensoresHost from "./Pages/Aplicacao/SensoresHost";
import HistoricoSensor from "./Pages/Aplicacao/HistoricoSensor";
import UserList from "./Pages/Listagens/Usuario";
import UserForm from "./Pages/Cadastros/Usuario";
import Login from "./Pages/Aplicacao/Login";
import Auth from "./Services/auth.service";

function Routes() {
  return (
    <BrowserRouter basename="/snmp">
      <Route component={Login} path="/login" />
      <PrivateRoute component={Dashboard} path="/" exact />
      <PrivateRoute component={Dashboard} path="/dashboard/:idGrupo" />

      <PrivateRoute component={GroupForm} path="/groupform" exact />
      <PrivateRoute component={GroupForm} path="/groupform/:id" />
      <PrivateRoute component={HostGroupList} path="/grouplist" />

      <PrivateRoute component={HostForm} path="/hostform" exact />
      <PrivateRoute component={HostForm} path="/hostform/:id" />
      <PrivateRoute component={HostList} path="/hostlist" />

      <PrivateRoute component={TemplateForm} path="/templateform" exact />
      <PrivateRoute component={TemplateForm} path="/templateform/:id" />
      <PrivateRoute component={TemplateList} path="/templatelist" />

      <PrivateRoute component={Problemas} path="/problemas" />

      <PrivateRoute component={EmailForm} path="/emailform" exact />

      <PrivateRoute
        component={SensoresHost}
        path="/sensoreshost/:idHost"
        exact
      />

      <PrivateRoute
        component={HistoricoSensor}
        path="/historico/:idHost/:idSensor"
        exact
      />

      <PrivateRoute component={UserList} path="/userlist" />
      <PrivateRoute component={UserForm} path="/userform" exact />
      <PrivateRoute component={UserForm} path="/userform/:id" />
    </BrowserRouter>
  );
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login", state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default Routes;
