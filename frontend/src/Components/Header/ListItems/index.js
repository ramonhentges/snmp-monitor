import React from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ErrorIcon from "@material-ui/icons/Error";
import ComputerIcon from "@material-ui/icons/Computer";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import PeopleIcon from "@material-ui/icons/People";

export default function ListItems(props) {
  return (
    <div>
      <ListItem
        selected={props.selected.dashboard}
        button
        component={Link}
        to={"/"}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        selected={props.selected.problemas}
        button
        component={Link}
        to={{
          pathname: "/problemas",
          state: { abrir: false },
        }}
      >
        <ListItemIcon>
          <ErrorIcon />
        </ListItemIcon>
        <ListItemText primary="Problemas" />
      </ListItem>
      <ListItem
        selected={props.selected.hosts}
        button
        component={Link}
        to={{
          pathname: "/hostlist",
          state: { abrir: false },
        }}
      >
        <ListItemIcon>
          <ComputerIcon />
        </ListItemIcon>
        <ListItemText primary="Hosts" />
      </ListItem>
      <ListItem
        selected={props.selected.hostgroup}
        button
        component={Link}
        to={{
          pathname: "/grouplist",
          state: { abrir: false },
        }}
      >
        <ListItemIcon>
          <GroupWorkIcon />
        </ListItemIcon>
        <ListItemText primary="Grupos de Hosts" />
      </ListItem>
      <ListItem
        button
        selected={props.selected.templates}
        component={Link}
        to={{
          pathname: "/templatelist",
          state: { abrir: false },
        }}
      >
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Templates" />
      </ListItem>
      <ListItem
        button
        selected={props.selected.usuarios}
        component={Link}
        to={"/userlist"}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Usuários" />
      </ListItem>
    </div>
  );
}
