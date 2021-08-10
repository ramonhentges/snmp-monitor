import React, { useState, useEffect } from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ProfileMenu from "./ProfileMenu";
import ListItems from "./ListItems";
import useStyles from "./styles";

export default function Header(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(JSON.parse(localStorage.getItem("painelAberto")));
  const handleDrawerOpen = () => {
    localStorage.setItem("painelAberto", true);
    setOpen(true);
  };
  const handleDrawerClose = () => {
    localStorage.setItem("painelAberto", false);
    setOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("painelAberto") === null) {
      localStorage.setItem("painelAberto", true);
      setOpen(true);
    }
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            noWrap
            className={classes.title}
          >
            Monitoramento SNMP
          </Typography>
          <ProfileMenu selected={props.selected} theme={props.theme} setTheme={props.setTheme}/>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <ListItems selected={props.selected} />
        <Divider />
      </Drawer>
    </div>
  );
}
