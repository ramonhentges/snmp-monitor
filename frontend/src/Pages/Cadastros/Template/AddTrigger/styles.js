import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  gridButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borda: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

export default useStyles;
