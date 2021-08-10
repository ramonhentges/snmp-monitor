import React from "react";
import { useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import Brightness4 from "@material-ui/icons/Brightness4";
import Brightness7 from "@material-ui/icons/Brightness7";
import EmailIcon from "@material-ui/icons/Email";
import Auth from "../../../Services/auth.service";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export default function ProfileMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const [theme, setTheme] = React.useState(props.theme);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    Auth.logout();
    history.push("/login");
  };

  const trocarTema = () => {
    localStorage.setItem("darkMode", !theme);
    setTheme(!theme);
    props.setTheme(!theme);
  };

  return (
    <div>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="inherit"
        onClick={trocarTema}
      >
        {theme ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        <PersonIcon />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          selected={props.selected.email}
          button
          component={Link}
          to={"/emailform"}
        >
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Email" />
        </MenuItem>
        <MenuItem button onClick={logout}>
          <ListItemIcon>
            <ExitIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
